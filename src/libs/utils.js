import {displayColumnToQueryColumn} from "./constants.js";

export function isToday(date){
    const today = new Date();
    const formattedDate = new Date(date);
    return formattedDate.getDate() === today.getDate() &&
        formattedDate.getMonth() === today.getMonth() &&
        formattedDate.getFullYear() === today.getFullYear();
}

export function formatDate(dateString) {
    if(dateString == null) return "-"
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function sortByDate(data, columnId, direction) {
    return data.slice().sort((a, b) => {
        const dateA = new Date(a[displayColumnToQueryColumn[columnId]]);
        const dateB = new Date(b[displayColumnToQueryColumn[columnId]]);
        return direction === 'desc' ? dateA - dateB : dateB - dateA;
    });
}

export function sortByFirmwareVersion(data, columnId, direction) {
    return data.slice().sort((a, b) => {
        const [aMajor, aMinor, aPatch] = a[displayColumnToQueryColumn[columnId]].split('.').map(Number);
        const [bMajor, bMinor, bPatch] = b[displayColumnToQueryColumn[columnId]].split('.').map(Number);

        if (aMajor !== bMajor) return direction === 'asc' ? aMajor - bMajor : bMajor - aMajor;
        if (aMinor !== bMinor) return direction === 'asc' ? aMinor - bMinor : bMinor - aMinor;
        return direction === 'asc' ? aPatch - bPatch : bPatch - aPatch;
    });
}

export function sortByColumnId(data, columnId, direction) {
    return data.slice().sort((a, b) => {
        if (a[displayColumnToQueryColumn[columnId]] < b[displayColumnToQueryColumn[columnId]]) return direction === 'asc' ? -1 : 1;
        if (a[displayColumnToQueryColumn[columnId]] > b[displayColumnToQueryColumn[columnId]]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

}

export function sortByStatus(data, latestVersion) {
    return data.slice().sort((a, b) => {
        const aStatus = getStatus(a, latestVersion);
        const bStatus = getStatus(b, latestVersion);

        if (aStatus === bStatus) return 0;
        if (aStatus === 'checkmark') return -1;
        if (bStatus === 'checkmark') return 1;
        if (aStatus === 'loading') return -1;
        if (bStatus === 'loading') return 1;
        return 0;
    });
}

function getStatus(device, latestVersion) {
    if (device.version === latestVersion) return 'checkmark';
    if (!device.last_update) return 'loading';
    return 'empty';
}
