/**
 * Filters stock request records based on a relative date filter.
 * 
 * @param {Array} requests - Array of objects containing created_at
 * @param {string} filterType - 'today' | 'week' | 'month' | 'all'
 * @returns {Array} Filtered requests
 */
export const filterRequestsByDate = (requests, filterType) => {
    if (!requests || !Array.isArray(requests)) return [];
    if (filterType === 'all') return requests;

    const now = new Date();
    
    if (filterType === 'today') {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        
        return requests.filter(req => {
            const reqDate = new Date(req.created_at);
            return reqDate >= startOfToday && reqDate <= endOfToday;
        });
    }
    
    if (filterType === 'week') {
        const currentDay = now.getDay();
        const mondayDiff = currentDay === 0 ? -6 : 1 - currentDay;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayDiff, 0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return requests.filter(req => {
            const reqDate = new Date(req.created_at);
            return reqDate >= startOfWeek && reqDate <= endOfWeek;
        });
    }
    
    if (filterType === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        
        return requests.filter(req => {
            const reqDate = new Date(req.created_at);
            return reqDate >= startOfMonth && reqDate <= endOfMonth;
        });
    }
    
    return requests;
};

/**
 * Filters absent employees based on their leave start/end dates.
 * 
 * @param {Array} absents - Array of absent employee objects containing leave_start_date and leave_end_date
 * @param {string} filterType - 'today' | 'week' | 'month' | 'all'
 * @returns {Array} Filtered absent employees
 */
export const filterAbsentsByDate = (absents, filterType) => {
    if (!absents || !Array.isArray(absents)) return [];
    if (filterType === 'all') return absents;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    if (filterType === 'today') {
        return absents.filter(emp => {
            const start = new Date(emp.leave_start_date).getTime();
            const end = new Date(emp.leave_end_date).getTime();
            return todayTime >= start && todayTime <= end;
        });
    }

    if (filterType === 'week') {
        const currentDay = now.getDay();
        const mondayDiff = currentDay === 0 ? -6 : 1 - currentDay;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayDiff, 0, 0, 0, 0).getTime();
        const endOfWeek = startOfWeek + (7 * 24 * 60 * 60 * 1000) - 1;

        return absents.filter(emp => {
            const start = new Date(emp.leave_start_date).getTime();
            const end = new Date(emp.leave_end_date).getTime();
            // Overlaps if start is before endOfWeek and end is after startOfWeek
            return start <= endOfWeek && end >= startOfWeek;
        });
    }

    if (filterType === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        return absents.filter(emp => {
            const start = new Date(emp.leave_start_date).getTime();
            const end = new Date(emp.leave_end_date).getTime();
            return start <= endOfMonth && end >= startOfMonth;
        });
    }

    return absents;
};

/**
 * Filters requests that contain single/range start and end dates (e.g. LeaveRequest log, VehicleRequest log).
 * 
 * @param {Array} logs - Requisitions list containing leave_start_date/leave_end_date or start_date/end_date
 * @param {string} filterType - 'today' | 'week' | 'month' | 'all'
 * @returns {Array} Filtered logs
 */
export const filterLogsByDate = (logs, filterType) => {
    if (!logs || !Array.isArray(logs)) return [];
    if (filterType === 'all') return logs;

    const now = new Date();
    const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    if (filterType === 'today') {
        return logs.filter(log => {
            const startStr = log.leave_start_date || log.start_date;
            const endStr = log.leave_end_date || log.end_date;
            if (!startStr) return false;
            
            const start = new Date(startStr).getTime();
            const end = endStr ? new Date(endStr).getTime() : start;
            return todayTime >= start && todayTime <= end;
        });
    }

    if (filterType === 'week') {
        const currentDay = now.getDay();
        const mondayDiff = currentDay === 0 ? -6 : 1 - currentDay;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayDiff, 0, 0, 0, 0).getTime();
        const endOfWeek = startOfWeek + (7 * 24 * 60 * 60 * 1000) - 1;

        return logs.filter(log => {
            const startStr = log.leave_start_date || log.start_date;
            const endStr = log.leave_end_date || log.end_date;
            if (!startStr) return false;

            const start = new Date(startStr).getTime();
            const end = endStr ? new Date(endStr).getTime() : start;
            return start <= endOfWeek && end >= startOfWeek;
        });
    }

    if (filterType === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        return logs.filter(log => {
            const startStr = log.leave_start_date || log.start_date;
            const endStr = log.leave_end_date || log.end_date;
            if (!startStr) return false;

            const start = new Date(startStr).getTime();
            const end = endStr ? new Date(endStr).getTime() : start;
            return start <= endOfMonth && end >= startOfMonth;
        });
    }

    return logs;
};
