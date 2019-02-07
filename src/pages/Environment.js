
export const environment = {
    production: false,
    apiUrl: 'http://192.168.10.109:3000/api/',
    dynamicUrl: 'http://192.168.10.109:3000/',
    publicUrl: 'http://180.211.103.189:3000/api/'
};
export const moduleUrls = {
    Kra: 'kra_master',
    Kpi: 'kpi_master',
    Jobtitle: 'jobtitle_master',
    ProjectComplexity: 'project_type_master',
    Department: 'department_master',
    ScaleSet: 'scale_set_master',
    Role: 'role_master',
    User: 'user_master',
    Project: 'project_master'
}
export const Type = {
    get: 'GET',
    post: 'POST',
    patch: 'PATCH',
    deletetype: 'DELETE'
}
export const Notification = {
    saved: 'Saved Successfully',
    updated: 'Updated Successfully',
    deleted: 'Deleted Successfully'
}
export const ModuleNames = {
    kra: 'KRA',
    kpi: 'KPI',
    Jobtitle: 'JobTitle',
    Project: 'Project',
    User: 'User',
    Role: 'Role',
    Department: 'Department',
    ScaleSet: 'ScaleSet'
}

