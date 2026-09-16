// ====== CHARTS INITIALIZATION (called by main.js after content injection) ======
function initializePageSpecific(page) {
    switch (page) {
        case 'dashboard':        initDashboardCharts();      break;
        case 'kpi-dashboard':    initKPICharts();            break;
        case 'vision-dashboard': initVisionCharts();         break;
        case 'cafe-sales':       initCafeSalesCharts();      break;
        case 'roastery-sales':   initRoasterySalesCharts();  break;
    }
}

// ====== GLOBAL CHART.JS LIGHT SAAS DEFAULTS ======
if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#64748B';
    Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.05)';
    Chart.defaults.font.family = "'IBM Plex Sans Arabic', sans-serif";
    Chart.defaults.font.weight = '400';
    if (Chart.defaults.plugins && Chart.defaults.plugins.tooltip) {
        Chart.defaults.plugins.tooltip.padding = 10;
        Chart.defaults.plugins.tooltip.cornerRadius = 8;
        Chart.defaults.plugins.tooltip.backgroundColor = '#0F172A';
        Chart.defaults.plugins.tooltip.titleColor = '#FFFFFF';
        Chart.defaults.plugins.tooltip.bodyColor = '#F8FAFC';
    }
}

// ====== SAFE CHART FACTORY ======
function createChart(id, config) {
    const el = document.getElementById(id);
    if (!el) return null;
    // Destroy previous instance if exists
    const existing = Chart.getChart(el);
    if (existing) existing.destroy();
    return new Chart(el, config);
}

// ====== SHARED CHART DEFAULTS ======
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
            labels: {
                color: '#64748B',
                font: { family: "'IBM Plex Sans Arabic', sans-serif" }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                borderColor: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: '#64748B',
                font: { family: "'IBM Plex Sans Arabic', sans-serif" }
            }
        },
        y: {
            grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                borderColor: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: '#64748B',
                font: { family: "'IBM Plex Sans Arabic', sans-serif" }
            }
        }
    }
};

const brandColors = {
    primary:     '#0284C7',
    primaryLight:'rgba(2, 132, 199, 0.12)',
    teal:        '#0D9488',
    tealLight:   'rgba(13, 148, 136, 0.12)',
    cyan:        '#06B6D4',
    slate:       '#64748B',
    slateLight:  '#F1F5F9',
    green:       '#16A34A',
    greenLight:  'rgba(22, 163, 74, 0.12)',
    red:         '#DC2626',
    yellow:      '#D97706',
    // Aliases to preserve backward compatibility:
    brown:       '#0284C7',
    brownLight:  'rgba(2, 132, 199, 0.12)',
    tan:         '#0D9488',
    gold:        '#06B6D4',
    wheat:       '#38BDF8'
};

// ====== DASHBOARD CHARTS ======
function initDashboardCharts() {
    // Weekly Sales Line Chart
    createChart('weekSalesChart', {
        type: 'line',
        data: {
            labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            datasets: [{
                label: 'المبيعات (ريال)',
                data: [2100, 2450, 2300, 2680, 2890, 3100, 2750],
                borderColor: brandColors.primary,
                backgroundColor: brandColors.primaryLight,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: brandColors.primary,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                x: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { color: '#64748B' }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#64748B',
                        callback: v => Number(v).toLocaleString('en-US') + ' ﷼'
                    }
                }
            }
        }
    });

    // Product Distribution Doughnut
    createChart('productDistChart', {
        type: 'doughnut',
        data: {
            labels: ['إسبريسو', 'لاتيه', 'كابتشينو', 'أمريكانو', 'أخرى'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#0284C7',
                    '#0D9488',
                    '#06B6D4',
                    '#38BDF8',
                    '#94A3B8'
                ],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        color: '#64748B',
                        font: { family: "'IBM Plex Sans Arabic', sans-serif" },
                        padding: 12
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// ====== KPI DASHBOARD CHARTS ======
function initKPICharts() {
    // 6-Month Sales Trend
    createChart('salesTrendChart', {
        type: 'line',
        data: {
            labels: ['أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس'],
            datasets: [{
                label: 'المبيعات الشهرية',
                data: [52000, 58000, 61000, 59000, 65000, 68500],
                borderColor: brandColors.green,
                backgroundColor: brandColors.greenLight,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: brandColors.green,
                pointRadius: 4
            }]
        },
        options: {
            ...chartDefaults,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { color: '#64748B' }
                },
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#64748B',
                        callback: v => (v / 1000) + 'K ﷼'
                    }
                }
            }
        }
    });

    // Revenue vs Cost Grouped Bar
    createChart('revenueCostChart', {
        type: 'bar',
        data: {
            labels: ['أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس'],
            datasets: [
                {
                    label: 'الإيرادات',
                    data: [52000, 58000, 61000, 59000, 65000, 68500],
                    backgroundColor: brandColors.teal,
                    borderRadius: 6
                },
                {
                    label: 'التكاليف',
                    data: [38000, 40000, 42000, 41000, 43000, 45500],
                    backgroundColor: brandColors.red,
                    borderRadius: 6
                }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    rtl: true,
                    labels: { color: '#64748B', padding: 12 }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { color: '#64748B' }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#64748B',
                        callback: v => (v / 1000) + 'K ﷼'
                    }
                }
            }
        }
    });
}

// ====== VISION DASHBOARD CHARTS ======
function initVisionCharts() {
    createChart('monthlyRevenueChart', {
        type: 'bar',
        data: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
            datasets: [
                {
                    label: 'مبيعات البار',
                    data: [35000, 38000, 42000, 40000, 45000, 48000],
                    backgroundColor: brandColors.primary,
                    borderRadius: 6
                },
                {
                    label: 'مبيعات المحمصة',
                    data: [24000, 27000, 26000, 29000, 30000, 32000],
                    backgroundColor: brandColors.teal,
                    borderRadius: 6
                }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    rtl: true,
                    labels: { color: '#64748B', padding: 12 }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { color: '#64748B' }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#64748B',
                        callback: v => (v / 1000) + 'K ﷼'
                    }
                }
            }
        }
    });
}

// ====== CAFE SALES CHARTS ======
function initCafeSalesCharts() {
    createChart('shiftComparisonChart', {
        type: 'bar',
        data: {
            labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            datasets: [
                {
                    label: 'الشفت الصباحي',
                    data: [850, 920, 880, 950, 1020, 1100, 980],
                    backgroundColor: brandColors.cyan,
                    borderRadius: 6
                },
                {
                    label: 'الشفت المسائي',
                    data: [1250, 1530, 1420, 1730, 1870, 2000, 1770],
                    backgroundColor: brandColors.primary,
                    borderRadius: 6
                }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    rtl: true,
                    labels: { color: '#64748B', padding: 12 }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { color: '#64748B' }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#64748B',
                        callback: v => Number(v).toLocaleString('en-US') + ' ﷼'
                    }
                }
            }
        }
    });

    createChart('topProductsChart', {
        type: 'bar',
        data: {
            labels: ['لاتيه فانيليا', 'كابتشينو', 'أمريكانو', 'موكا', 'فلات وايت'],
            datasets: [{
                label: 'عدد المبيعات',
                data: [320, 280, 180, 95, 65],
                backgroundColor: [
                    '#0284C7',
                    '#0D9488',
                    '#06B6D4',
                    '#38BDF8',
                    '#64748B'
                ],
                borderRadius: 6
            }]
        },
        options: {
            ...chartDefaults,
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { color: '#64748B' }
                },
                y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { color: '#64748B' }
                }
            }
        }
    });
}

// ====== ROASTERY SALES CHARTS ======
function initRoasterySalesCharts() {
    createChart('salesChannelsChart', {
        type: 'pie',
        data: {
            labels: ['B2B (جملة)', 'رف المحل', 'أونلاين', 'نقاط بيع'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: [
                    '#0284C7',
                    '#0D9488',
                    '#06B6D4',
                    '#38BDF8'
                ],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    rtl: true,
                    labels: { color: '#64748B', padding: 12 }
                }
            }
        }
    });

    createChart('roasteryTrendChart', {
        type: 'line',
        data: {
            labels: ['أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس'],
            datasets: [{
                label: 'مبيعات المحمصة (كجم)',
                data: [120, 145, 138, 160, 175, 195],
                borderColor: brandColors.teal,
                backgroundColor: brandColors.tealLight,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: brandColors.teal,
                pointRadius: 4
            }]
        },
        options: {
            ...chartDefaults,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { color: '#64748B' }
                },
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        color: '#64748B',
                        callback: v => v + ' كجم'
                    }
                }
            }
        }
    });
}
