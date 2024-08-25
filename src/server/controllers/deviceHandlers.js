import {connection} from "../connection.js";
import {errorResponse, successResponse} from "../utils/helper.utils.js";
import {sortColumnsToDbColumns} from "../configs/constants.config.js";

export const deviceHandlerWithPagination = async (req, res) => {
    let {page, pageSize} = req.query;

    if (!page && !pageSize) {
        page = 1
        pageSize = 10;
    }

    const offset = (page - 1) * pageSize;

    const totalPages = await connection.raw("SELECT count(*) FROM devices d JOIN users u ON u.email = d.user_email WHERE u.subscription_ends >= current_timestamp")

    const devicesWithAllData = await connection.raw(`
        SELECT d.id,
               d.name                                           AS device_name,
               u.admin                                          AS is_admin,
               u.email,
               (fv.major || '.' || fv.minor || '.' || fv.patch) AS version,
               upt.last_update
        FROM devices d
                 JOIN users u ON u.email = d.user_email
                 JOIN firmware_versions fv ON d.firmware_version_id = fv.id
                 LEFT JOIN (SELECT upt.device_id, MAX(upt.finished) AS last_update
                            FROM updates upt
                            GROUP BY upt.device_id) upt
                           ON d.id = upt.device_id
        WHERE u.subscription_ends >= current_timestamp LIMIT ?
        OFFSET ?`, [pageSize, offset])

    const lastFirmwareVersion = await connection.raw(`
        SELECT (firmware_versions.major || '.' || firmware_versions.minor || '.' ||
                firmware_versions.patch) AS latest_version
        FROM firmware_versions
        ORDER BY id DESC LIMIT 1
    `)
    const totalDevicesCount = totalPages[0]["count(*)"];
    const totalPage = Math.ceil(totalDevicesCount / pageSize);

    if (page > totalPage) return errorResponse(res, 400, "Page number is too high");

    successResponse(res, 200, {
        deviceWithAllData: devicesWithAllData,
        lastFirmwareVersion: lastFirmwareVersion[0].latest_version,
        pagination: {
            currentPage: parseInt(page),
            pageSize: parseInt(pageSize),
            totalDevices: totalDevicesCount,
            totalPage,
        },
    });
}

export const deviceHandlerWithSortingAndPagination = async (req, res) => {
    let {page, pageSize, sortColumn, sortDirection} = req.query;

    if (!page && !pageSize) {
        page = 1
        pageSize = 10;
    }

    if (!sortColumn && !sortDirection) {
        sortColumn = "id";
        sortDirection = "DESC";
    }

    const offset = (page - 1) * pageSize;

    const totalPages = await connection.raw("SELECT count(*) FROM devices d JOIN users u ON u.email = d.user_email WHERE u.subscription_ends >= current_timestamp")

    const lastFirmwareVersion = await connection.raw(`
        SELECT (firmware_versions.major || '.' || firmware_versions.minor || '.' ||
                firmware_versions.patch) AS latest_version
        FROM firmware_versions
        ORDER BY id DESC LIMIT 1`)

    const devicesWithAllData = await connection.raw(`
        SELECT d.id,
               d.name                                           AS device_name,
               u.admin                                          AS is_admin,
               u.email,
               (fv.major || '.' || fv.minor || '.' || fv.patch) AS version,
               upt.last_update
        FROM devices d
                 JOIN
             users u ON u.email = d.user_email
                 JOIN
             firmware_versions fv ON d.firmware_version_id = fv.id
                 LEFT JOIN
             (SELECT upt.device_id, MAX(upt.finished) AS last_update
              FROM updates upt
              GROUP BY upt.device_id) upt ON d.id = upt.device_id
        WHERE u.subscription_ends >= CURRENT_TIMESTAMP
        ORDER BY CASE
                     WHEN '${sortColumn}' = 'status' THEN
                         CASE
                             WHEN (fv.major || '.' || fv.minor || '.' || fv.patch) = ? THEN 1
                             WHEN upt.last_update IS NULL THEN 2
                             ELSE 3
                             END
                     ELSE NULL
                     END,
                 COALESCE(
                         CASE WHEN '${sortColumn}' = 'version' THEN CAST(fv.major AS INTEGER) END,
                         ${sortColumnsToDbColumns[sortColumn]}
                 ) ${sortDirection},
        COALESCE(
            CASE WHEN '${sortColumn}' = 'version' THEN CAST(fv.minor AS INTEGER) END, 
            0
        ) ${sortDirection},
            COALESCE (
            CASE WHEN '${sortColumn}' = 'version' THEN CAST (fv.patch AS INTEGER) END,
            0
            ) ${sortDirection}
            LIMIT
            ?
        OFFSET ?;
    `, [lastFirmwareVersion[0].latest_version, pageSize, offset]);

    const totalDevicesCount = totalPages[0]["count(*)"];
    const totalPage = Math.ceil(totalDevicesCount / pageSize);

    if (page > totalPage) return errorResponse(res, 400, "Page number is too high");

    successResponse(res, 200, {
        deviceWithAllData: devicesWithAllData,
        lastFirmwareVersion: lastFirmwareVersion[0].latest_version,
        pagination: {
            currentPage: parseInt(page),
            pageSize: parseInt(pageSize),
            totalDevices: totalDevicesCount,
            totalPage,
        },
    });
}