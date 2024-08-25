import {connection} from "../connection.js";
import {errorResponse, successResponse} from "../utils.js";

export const deviceHandler = async (req, res) => {
    let {page, pageSize} = req.query;

    if(!page && !pageSize){
        page = 1
        pageSize = 10;
    }

    const offset = (page - 1) * pageSize;

    const devicesWithAllData = await connection.raw("select d.id, d.name as device_name, u.admin as is_admin, u.email, (fv.major || '.' || fv.minor || '.' || fv.patch) as version, upt.last_update, COUNT(*) OVER() AS total_count from devices d join users u on u.email = d.user_email join firmware_versions fv on d.firmware_version_id = fv.id left join ( select upt.device_id, MAX(upt.finished) as last_update from updates upt group by upt.device_id) upt on d.id = upt.device_id where u.subscription_ends >= current_timestamp limit ? offset ? ", [pageSize, offset])
    const lastFirmwareVersion = await connection.raw("select (firmware_versions.major || '.' || firmware_versions.minor || '.' || firmware_versions.patch) as latest_version from firmware_versions order by id desc limit 1")
    const totalDevicesCount = devicesWithAllData.length > 0 ? devicesWithAllData[0].total_count : 0;
    const totalPages = Math.ceil(totalDevicesCount / pageSize);

    if(page > totalPages) return errorResponse(res, 400, "Page number is too high");

    successResponse(res, 200,{
        deviceWithAllData: devicesWithAllData,
        lastFirmwareVersion: lastFirmwareVersion[0].latest_version,
        pagination: {
            currentPage: parseInt(page),
            pageSize: parseInt(pageSize),
            totalDevices: totalDevicesCount,
            totalPages,
        },
    });
}