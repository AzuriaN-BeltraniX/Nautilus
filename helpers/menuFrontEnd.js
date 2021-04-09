/**
 *  Auxiliar para:
 *      - Almacenar de forma dinámica el menú del Dashboard,
 *      - Verificar el rol de usuario, y así mostrar elementos del menú especificos para administradores.
 */

const getMenuFrontEnd = (role) => {
    const menu = [
        { // Dashboard Menu
            title: 'Configuración',
            icon: 'cog-outline',
            submenu: [
                {title: 'General', icon: 'earth-outline', url: '/config'},
                {title: 'Información', icon: 'information-circle-outline', url: '/info'},
            ]
        }
    ];

    if(role === 'ADMIN_ROLE') {
        menu.unshift(
            { // Maintenance Menu (Users, Doctor & Medical Patient)
                title: 'Mantenimientos',
                icon: 'construct-outline',
                submenu: [
                    {title: 'Usuarios', icon: 'people-outline', url: '/dashboard/usuarios'},
                    {title: 'Médicos', icon: 'add-outline', url: '/dashboard/medicos'},
                    {title: 'Pacientes', icon: 'hourglass-outline', url: '/dashboard/pacientes'}
                ]
            },
            { // Point of Sale Menu (Stocks, Products, Sales, Shop)
                title: 'Tienda',
                icon: 'bag-outline',
                submenu: [
                    {title: 'Almacenes', icon: 'bag-handle-outline', url: '/dashboard/almacenes'},
                    {title: 'Productos', icon: 'pricetag-outline', url: '/dashboard/productos'},
                ]
            }
        );
    };

    return menu;
}

module.exports = {
    getMenuFrontEnd
}