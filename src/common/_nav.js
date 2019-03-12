export default {
    items: [
        {
            name: 'My KRA',
            url: '/dashboard',
            icon: 'fa fa-dashboard',
        },
        {
            name: 'My Team',
            url: '/myteam',
            icon: 'fa fa-users',
        },

        {
            name: 'UI Control',
            icon: 'fa fa-cog',
            id: 'lnkSettings',
            children: [
                {
                    name: 'InnerPage',
                    url: '/innerpage',
                    icon: 'fa fa-plus',
                },
                {
                    name: 'UI Control',
                    url: '/demo',
                    icon: 'fa fa-cogs',
                },

            ]
        },

        {
            name: 'Administrator',
            icon: 'fa fa-graduation-cap',
            id: 'lnkSettings',
            children: [{
                name: 'KRA',
                url: '/kra',
                icon: 'fa fa-area-chart',
            },

            {
                name: 'Role',
                url: '/role',
                icon: 'fa fa-user-secret',
            },
            {
                name: 'Quarter',
                url: '/quater',
                icon: 'fa fab fa-quora',
            },

            {
                name: 'User Management',
                url: '/user-management',
                icon: 'fa fa-user-o'
            },
            {
                name: "Department",
                url: '/Department',
                icon: 'fa fa-building-o'
            },
            {
                name: 'KPI',
                url: '/kpi',
                icon: 'fa fa-key',
            },
            {
                name: 'Complexity Master',
                url: '/complexity-master',
                icon: 'fa fa-snowflake-o',
            },
            {
                name: 'Template',
                url: '/templateList',
                icon: 'fa fa-clipboard',
            },

            {
                name: 'Scale Set',
                url: '/scale-set',
                icon: 'fa fa-balance-scale',
            },
            {
                name: 'Designation',
                url: '/designation',
                icon: 'fa fa-id-card-o',
            },
            {
                name: 'Projects',
                url: '/projects',
                icon: 'fa fa-sitemap',
            },
            {
                name: 'Assign-Template',
                url: '/Template',
                icon: 'fa fa-tasks',
            },

            ]
        }

]
};
