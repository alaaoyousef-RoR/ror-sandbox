// ====== DEPARTMENT DATA ======
const departmentsData = {
    production: {
        title: 'قسم المحمصة والإنتاج',
        icon: 'fa-industry',
        description: 'مسؤول عن عمليات التحميص والإنتاج وضمان الجودة',
        tasks: [
            { id: 1,  title: 'جدولة دفعات التحميص الأسبوعية',       priority: 'high',   frequency: 'أسبوعي',          estimatedTime: '2 ساعة' },
            { id: 2,  title: 'فحص جودة البن الأخضر الوارد',          priority: 'high',   frequency: 'عند الاستلام',    estimatedTime: '1 ساعة' },
            { id: 3,  title: 'معايرة وتنظيف المحمصة',                 priority: 'high',   frequency: 'يومي',            estimatedTime: '30 دقيقة' },
            { id: 4,  title: 'تسجيل بروفايلات التحميص',               priority: 'medium', frequency: 'لكل دفعة',        estimatedTime: '15 دقيقة' },
            { id: 5,  title: 'فحص الجودة بعد التحميص (Cupping)',      priority: 'high',   frequency: 'لكل دفعة جديدة', estimatedTime: '1 ساعة' },
            { id: 6,  title: 'إدارة مخزون البن الأخضر',               priority: 'medium', frequency: 'أسبوعي',          estimatedTime: '1 ساعة' },
            { id: 7,  title: 'تغليف وتعبئة المنتجات',                 priority: 'medium', frequency: 'يومي',            estimatedTime: '3 ساعات' },
            { id: 8,  title: 'حساب تكلفة الإنتاج لكل دفعة',           priority: 'medium', frequency: 'شهري',            estimatedTime: '2 ساعة' },
            { id: 9,  title: 'تطوير خلطات جديدة',                     priority: 'low',    frequency: 'شهري',            estimatedTime: '4 ساعات' },
            { id: 10, title: 'تدريب الفريق على عمليات الإنتاج',        priority: 'medium', frequency: 'ربع سنوي',       estimatedTime: '4 ساعات' }
        ],
        kpis: [
            { name: 'كفاءة التحميص',  current: 92, target: 95 },
            { name: 'الإنتاج اليومي', current: 85, target: 100 },
            { name: 'نسبة الهدر',     current: 3,  target: 2 }
        ]
    },

    quality: {
        title: 'قسم ضبط الجودة والبحث والتطوير',
        icon: 'fa-award',
        description: 'مسؤول عن معايير الجودة والابتكار في المنتجات',
        tasks: [
            { id: 1,  title: 'جلسات Cupping أسبوعية',                          priority: 'high',   frequency: 'أسبوعي',      estimatedTime: '2 ساعة' },
            { id: 2,  title: 'تقييم جودة البن الأخضر (Green Grading)',          priority: 'high',   frequency: 'عند الاستلام',estimatedTime: '1 ساعة' },
            { id: 3,  title: 'معايرة أجهزة القياس (Refractometer, TDS)',        priority: 'medium', frequency: 'أسبوعي',      estimatedTime: '30 دقيقة' },
            { id: 4,  title: 'توثيق معايير الجودة لكل منتج',                    priority: 'high',   frequency: 'شهري',        estimatedTime: '3 ساعات' },
            { id: 5,  title: 'اختبار منتجات جديدة',                             priority: 'medium', frequency: 'شهري',        estimatedTime: '4 ساعات' },
            { id: 6,  title: 'تدريب الباريستا على معايير الجودة',               priority: 'high',   frequency: 'شهري',        estimatedTime: '2 ساعة' },
            { id: 7,  title: 'متابعة شكاوى الجودة',                             priority: 'high',   frequency: 'فوري',        estimatedTime: 'حسب الحاجة' },
            { id: 8,  title: 'البحث عن موردين جدد للبن',                        priority: 'low',    frequency: 'ربع سنوي',   estimatedTime: '8 ساعات' },
            { id: 9,  title: 'تطوير SOP للعمليات',                              priority: 'medium', frequency: 'ربع سنوي',   estimatedTime: '6 ساعات' },
            { id: 10, title: 'مراجعة معايير الصناعة العالمية',                  priority: 'low',    frequency: 'نصف سنوي',   estimatedTime: '4 ساعات' }
        ],
        kpis: [
            { name: 'رضا العملاء',    current: 4.5, target: 4.8 },
            { name: 'معدل المرتجعات', current: 1.2, target: 0.5 },
            { name: 'درجة الجودة',    current: 88,  target: 92 }
        ]
    },

    marketing: {
        title: 'قسم التسويق والعلامة التجارية',
        icon: 'fa-bullhorn',
        description: 'مسؤول عن بناء العلامة التجارية والتسويق الرقمي',
        tasks: [
            { id: 1,  title: 'نشر محتوى يومي على Instagram',                        priority: 'high',   frequency: 'يومي',                 estimatedTime: '1 ساعة' },
            { id: 2,  title: 'إنشاء فيديوهات قصيرة (Reels/TikTok)',                 priority: 'high',   frequency: '3 مرات أسبوعياً',      estimatedTime: '2 ساعة' },
            { id: 3,  title: 'التفاعل مع التعليقات والرسائل',                        priority: 'high',   frequency: 'يومي',                 estimatedTime: '30 دقيقة' },
            { id: 4,  title: 'تحديث Google My Business',                              priority: 'medium', frequency: 'أسبوعي',               estimatedTime: '30 دقيقة' },
            { id: 5,  title: 'تخطيط الحملات الموسمية',                               priority: 'medium', frequency: 'شهري',                 estimatedTime: '3 ساعات' },
            { id: 6,  title: 'تصوير المنتجات والعمليات',                             priority: 'medium', frequency: 'أسبوعي',               estimatedTime: '2 ساعة' },
            { id: 7,  title: 'البحث عن مؤثرين للتعاون (Barter)',                     priority: 'medium', frequency: 'شهري',                 estimatedTime: '2 ساعة' },
            { id: 8,  title: 'تحليل أداء المنشورات',                                 priority: 'medium', frequency: 'أسبوعي',               estimatedTime: '1 ساعة' },
            { id: 9,  title: 'تطوير استراتيجية المحتوى',                             priority: 'high',   frequency: 'شهري',                 estimatedTime: '4 ساعات' },
            { id: 10, title: 'إنشاء مواد ترويجية (بوسترات، منيو)',                   priority: 'low',    frequency: 'حسب الحاجة',           estimatedTime: '3 ساعات' }
        ],
        kpis: [
            { name: 'نمو المتابعين',   current: 450,   target: 1000 },
            { name: 'معدل التفاعل',    current: 3.2,   target: 5 },
            { name: 'الوصول الشهري',  current: 15000, target: 30000 }
        ]
    },

    sales: {
        title: 'قسم المبيعات وتطوير الأعمال (B2B)',
        icon: 'fa-handshake',
        description: 'مسؤول عن مبيعات الجملة وتطوير علاقات العملاء',
        tasks: [
            { id: 1,  title: 'بناء قائمة عملاء محتملين',                  priority: 'high',   frequency: 'يومي',           estimatedTime: '2 ساعة' },
            { id: 2,  title: 'متابعة العملاء الحاليين',                    priority: 'high',   frequency: 'أسبوعي',         estimatedTime: '3 ساعات' },
            { id: 3,  title: 'زيارات ميدانية للعملاء المحتملين',           priority: 'high',   frequency: 'أسبوعي',         estimatedTime: '4 ساعات' },
            { id: 4,  title: 'إعداد عروض أسعار مخصصة',                    priority: 'medium', frequency: 'حسب الطلب',      estimatedTime: '1 ساعة' },
            { id: 5,  title: 'تحديث CRM بمعلومات العملاء',                 priority: 'medium', frequency: 'يومي',           estimatedTime: '30 دقيقة' },
            { id: 6,  title: 'تنظيم عينات للعملاء المحتملين',             priority: 'medium', frequency: 'حسب الطلب',      estimatedTime: '1 ساعة' },
            { id: 7,  title: 'التفاوض على العقود',                        priority: 'high',   frequency: 'حسب الحاجة',     estimatedTime: 'متغير' },
            { id: 8,  title: 'تحليل المنافسين',                           priority: 'medium', frequency: 'شهري',           estimatedTime: '2 ساعة' },
            { id: 9,  title: 'حضور معارض وفعاليات القهوة',                priority: 'low',    frequency: 'حسب التوفر',     estimatedTime: 'يوم كامل' },
            { id: 10, title: 'إعداد تقارير المبيعات الشهرية',              priority: 'high',   frequency: 'شهري',           estimatedTime: '2 ساعة' }
        ],
        kpis: [
            { name: 'عدد العملاء الجدد', current: 3,     target: 10 },
            { name: 'قيمة العقود',       current: 25000, target: 60000 },
            { name: 'معدل التحويل',      current: 15,    target: 30 }
        ]
    },

    ecommerce: {
        title: 'قسم التجارة الإلكترونية واللوجستيات',
        icon: 'fa-shopping-cart',
        description: 'مسؤول عن المبيعات الإلكترونية والتوصيل',
        tasks: [
            { id: 1,  title: 'إعداد متجر إلكتروني (منصة مجانية)',     priority: 'high',   frequency: 'مرة واحدة',      estimatedTime: '8 ساعات' },
            { id: 2,  title: 'تحديث صور وأوصاف المنتجات',              priority: 'high',   frequency: 'شهري',           estimatedTime: '3 ساعات' },
            { id: 3,  title: 'معالجة الطلبات الإلكترونية',             priority: 'high',   frequency: 'يومي',           estimatedTime: '1 ساعة' },
            { id: 4,  title: 'تنسيق التوصيل مع شركات الشحن',          priority: 'high',   frequency: 'يومي',           estimatedTime: '1 ساعة' },
            { id: 5,  title: 'متابعة حالة الشحنات',                    priority: 'medium', frequency: 'يومي',           estimatedTime: '30 دقيقة' },
            { id: 6,  title: 'إدارة المخزون على المنصات',               priority: 'medium', frequency: 'يومي',           estimatedTime: '30 دقيقة' },
            { id: 7,  title: 'الرد على استفسارات العملاء',              priority: 'high',   frequency: 'يومي',           estimatedTime: '1 ساعة' },
            { id: 8,  title: 'البحث عن نقاط بيع جديدة (محلات)',       priority: 'medium', frequency: 'أسبوعي',         estimatedTime: '2 ساعة' },
            { id: 9,  title: 'تحليل بيانات المبيعات الإلكترونية',     priority: 'medium', frequency: 'أسبوعي',         estimatedTime: '1 ساعة' },
            { id: 10, title: 'تطوير استراتيجية التوزيع',               priority: 'medium', frequency: 'شهري',           estimatedTime: '3 ساعات' }
        ],
        kpis: [
            { name: 'الطلبات الشهرية',       current: 45, target: 150 },
            { name: 'نقاط البيع',             current: 2,  target: 10 },
            { name: 'معدل إتمام الطلبات',     current: 95, target: 98 }
        ]
    },

    maintenance: {
        title: 'قسم الصيانة والدعم الفني',
        icon: 'fa-tools',
        description: 'مسؤول عن صيانة المعدات والدعم الفني',
        tasks: [
            { id: 1,  title: 'الصيانة اليومية لماكينة الإسبريسو',      priority: 'high',   frequency: 'يومي',           estimatedTime: '30 دقيقة' },
            { id: 2,  title: 'تنظيف وصيانة المطاحن',                   priority: 'high',   frequency: 'يومي',           estimatedTime: '20 دقيقة' },
            { id: 3,  title: 'فحص المحمصة الدوري',                     priority: 'high',   frequency: 'أسبوعي',         estimatedTime: '1 ساعة' },
            { id: 4,  title: 'معايرة أجهزة القياس',                    priority: 'medium', frequency: 'أسبوعي',         estimatedTime: '30 دقيقة' },
            { id: 5,  title: 'الاحتفاظ بسجل الصيانة',                  priority: 'medium', frequency: 'يومي',           estimatedTime: '15 دقيقة' },
            { id: 6,  title: 'طلب قطع الغيار الضرورية',                priority: 'medium', frequency: 'حسب الحاجة',     estimatedTime: '1 ساعة' },
            { id: 7,  title: 'تدريب الفريق على الصيانة الأساسية',      priority: 'medium', frequency: 'ربع سنوي',      estimatedTime: '2 ساعة' },
            { id: 8,  title: 'فحص نظام التهوية والتبريد',              priority: 'medium', frequency: 'شهري',           estimatedTime: '1 ساعة' },
            { id: 9,  title: 'صيانة شاملة للمعدات',                   priority: 'high',   frequency: 'نصف سنوي',       estimatedTime: 'يوم كامل' },
            { id: 10, title: 'تحديث دليل الصيانة',                     priority: 'low',    frequency: 'سنوي',           estimatedTime: '3 ساعات' }
        ],
        kpis: [
            { name: 'وقت التوقف',        current: 2,    target: 1 },
            { name: 'الصيانة الوقائية',  current: 85,   target: 95 },
            { name: 'تكلفة الصيانة',     current: 3500, target: 3000 }
        ]
    },

    hr: {
        title: 'قسم الموارد البشرية',
        icon: 'fa-users',
        description: 'مسؤول عن إدارة الفريق والتطوير',
        tasks: [
            { id: 1,  title: 'إعداد جدول المناوبات',        priority: 'high',   frequency: 'أسبوعي',     estimatedTime: '1 ساعة' },
            { id: 2,  title: 'متابعة الحضور والانصراف',     priority: 'high',   frequency: 'يومي',       estimatedTime: '15 دقيقة' },
            { id: 3,  title: 'معالجة الرواتب',              priority: 'high',   frequency: 'شهري',       estimatedTime: '2 ساعة' },
            { id: 4,  title: 'تقييم أداء الموظفين',         priority: 'medium', frequency: 'ربع سنوي',  estimatedTime: '3 ساعات' },
            { id: 5,  title: 'تنظيم دورات تدريبية',         priority: 'medium', frequency: 'شهري',       estimatedTime: '4 ساعات' },
            { id: 6,  title: 'معالجة الشكاوى والمشاكل',     priority: 'high',   frequency: 'فوري',       estimatedTime: 'حسب الحاجة' },
            { id: 7,  title: 'التوظيف والتعيين',            priority: 'medium', frequency: 'حسب الحاجة', estimatedTime: '8 ساعات' },
            { id: 8,  title: 'تحديث ملفات الموظفين',        priority: 'low',    frequency: 'شهري',       estimatedTime: '1 ساعة' },
            { id: 9,  title: 'تنظيم أنشطة بناء الفريق',     priority: 'low',    frequency: 'ربع سنوي',  estimatedTime: '4 ساعات' },
            { id: 10, title: 'تطوير سياسات الموارد البشرية', priority: 'medium', frequency: 'سنوي',       estimatedTime: '6 ساعات' }
        ],
        kpis: [
            { name: 'رضا الموظفين',    current: 7.5, target: 8.5 },
            { name: 'معدل الدوران',    current: 15,  target: 10 },
            { name: 'ساعات التدريب',   current: 12,  target: 20 }
        ]
    },

    finance: {
        title: 'قسم المالية',
        icon: 'fa-calculator',
        description: 'مسؤول عن الإدارة المالية والتقارير',
        tasks: [
            { id: 1,  title: 'تسجيل المعاملات اليومية',        priority: 'high',   frequency: 'يومي',       estimatedTime: '1 ساعة' },
            { id: 2,  title: 'مطابقة الحسابات البنكية',          priority: 'high',   frequency: 'أسبوعي',     estimatedTime: '2 ساعة' },
            { id: 3,  title: 'إعداد تقرير المبيعات اليومي',      priority: 'high',   frequency: 'يومي',       estimatedTime: '30 دقيقة' },
            { id: 4,  title: 'متابعة الذمم المدينة',             priority: 'high',   frequency: 'أسبوعي',     estimatedTime: '2 ساعة' },
            { id: 5,  title: 'إعداد القوائم المالية الشهرية',    priority: 'high',   frequency: 'شهري',       estimatedTime: '4 ساعات' },
            { id: 6,  title: 'تحليل التكاليف والربحية',          priority: 'medium', frequency: 'شهري',       estimatedTime: '3 ساعات' },
            { id: 7,  title: 'إعداد الميزانية التقديرية',         priority: 'medium', frequency: 'ربع سنوي',  estimatedTime: '6 ساعات' },
            { id: 8,  title: 'مراجعة الفواتير والمصاريف',        priority: 'high',   frequency: 'أسبوعي',     estimatedTime: '2 ساعة' },
            { id: 9,  title: 'إدارة التدفقات النقدية',           priority: 'high',   frequency: 'أسبوعي',     estimatedTime: '1 ساعة' },
            { id: 10, title: 'إعداد تقارير للشركاء',             priority: 'high',   frequency: 'شهري',       estimatedTime: '3 ساعات' }
        ],
        kpis: [
            { name: 'دقة التقارير',           current: 95, target: 99 },
            { name: 'وقت إغلاق الشهر (أيام)', current: 5,  target: 3 },
            { name: 'التحصيل في الوقت',       current: 80, target: 95 }
        ]
    },

    procurement: {
        title: 'قسم المشتريات والتوريد وسلاسل الإمداد',
        icon: 'fa-truck-ramp-box',
        odooModule: 'Purchase + Inventory',
        description: 'مسؤول عن تأمين البن الأخضر والمواد التشغيلية وإدارة الموردين وخفض تكاليف التوريد وسلاسل الإمداد',
        tasks: [
            { id: 1,  title: 'فحص أسعار عقود البن الأخضر ومقارنة المستوردين',              priority: 'high',   frequency: 'أسبوعي',       estimatedTime: '2 ساعة' },
            { id: 2,  title: 'جدولة طلبيات أكياس الأرباع (250g) ومواد التعبئة والتغليف',         priority: 'high',   frequency: 'أسبوعي',       estimatedTime: '1.5 ساعة' },
            { id: 3,  title: 'متابعة مخزون الحليب والمشروبات البديلة أسبوعياً',               priority: 'high',   frequency: 'أسبوعي',       estimatedTime: '1 ساعة' },
            { id: 4,  title: 'التفاوض على شروط الدفع والخصومات للكميات',                     priority: 'medium', frequency: 'شهري',         estimatedTime: '3 ساعات' },
            { id: 5,  title: 'مراجعة جودة أكواب ومستهلكات البار الورقية والحرارية',             priority: 'medium', frequency: 'شهري',         estimatedTime: '1 ساعة' },
            { id: 6,  title: 'فحص سجل شهادات المنشأ والجمارك لحبوب البن المختص',              priority: 'high',   frequency: 'لكل شحنة',     estimatedTime: '2 ساعة' },
            { id: 7,  title: 'تأمين قطع الغيار الاستهلاكية السريعة للمطاحن والحماصة',          priority: 'medium', frequency: 'شهري',         estimatedTime: '2 ساعة' },
            { id: 8,  title: 'إدارة إشعارات انخفاض المخزون الحرج (Safety Stock)',               priority: 'high',   frequency: 'يومي',         estimatedTime: '30 دقيقة' },
            { id: 9,  title: 'تقييم أداء الموردين ومقارنة مؤشرات الالتزام بالمواعيد',          priority: 'medium', frequency: 'ربع سنوي',     estimatedTime: '4 ساعات' },
            { id: 10, title: 'إعداد تقرير المصروفات الشرائية الشهري لقسم المالية',             priority: 'high',   frequency: 'شهري',         estimatedTime: '3 ساعات' }
        ],
        kpis: [
            { name: 'دقة طلبات البن الأخضر والمواد', current: 92, target: 98, unit: '%' },
            { name: 'متوسط خفض التكاليف',            current: 5,  target: 8,  unit: '%' },
            { name: 'فترات التوريد والتوصيل SLA',     current: 36, target: 48, unit: 'ساعة' }
        ]
    }
};

// ====== HELPER: PRIORITY TEXT ======
function getPriorityText(priority) {
    const map = { high: 'أولوية عالية', medium: 'أولوية متوسطة', low: 'أولوية منخفضة' };
    return map[priority] || priority;
}

// ====== HELPER: KPI PROGRESS BAR WIDTH ======
function kpiProgressWidth(kpi) {
    if (kpi.unit === 'ساعة') {
        const ratio = (kpi.target / (kpi.current || 1)) * 100;
        return Math.min(Math.round(ratio), 100);
    }
    const ratio = (kpi.current / (kpi.target || 1)) * 100;
    return Math.min(Math.round(ratio), 100);
}

// ====== GET DEPARTMENT CONTENT ======
function getDepartmentContent(deptKey) {
    const dept = departmentsData[deptKey];
    if (!dept) return '<p>القسم غير موجود</p>';

    return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;">
            <div>
                <h2 class="page-title">
                    <i class="fas ${dept.icon}" style="color:var(--primary-color);margin-left:0.5rem;"></i>
                    ${dept.title}
                </h2>
                <p class="page-subtitle">${dept.description}</p>
            </div>
            ${dept.odooModule ? `<span class="badge info" style="font-size:0.8rem;padding:0.35rem 0.85rem;"><i class="fas fa-cubes"></i> Odoo: ${dept.odooModule}</span>` : ''}
        </div>

        <!-- Department KPIs -->
        <div class="stats-grid">
            ${dept.kpis.map(kpi => `
                <div class="stat-card primary">
                    <div class="stat-header">
                        <span class="stat-title">${kpi.name}</span>
                        <div class="stat-icon primary"><i class="fas fa-chart-bar"></i></div>
                    </div>
                    <div class="stat-value">${kpi.current}${kpi.unit ? ' ' + kpi.unit : ''}</div>
                    <div class="progress-container">
                        <div class="progress-label">
                            <span>الهدف: ${kpi.target}${kpi.unit ? ' ' + kpi.unit : ''}</span>
                            <span>${kpiProgressWidth(kpi)}%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width:${kpiProgressWidth(kpi)}%"></div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- Expert Recommended Tasks -->
        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">مهام القسم الموصى بها من الخبراء</h3>
                <button class="btn btn-primary" id="addDeptTaskBtn-${deptKey}" onclick="addDepartmentTask('${deptKey}')">
                    <i class="fas fa-plus"></i>
                    إضافة مهمة جديدة
                </button>
            </div>

            <div class="task-list">
                ${dept.tasks.map(task => `
                    <div class="task-item">
                        <input type="checkbox" class="task-checkbox" id="task-${deptKey}-${task.id}" aria-label="${task.title}">
                        <div class="task-content">
                            <div class="task-title">${task.title}</div>
                            <div class="task-meta">
                                <span><i class="fas fa-sync-alt"></i> ${task.frequency}</span>
                                <span><i class="fas fa-hourglass-half"></i> ${task.estimatedTime}</span>
                                <span class="task-priority ${task.priority}">${getPriorityText(task.priority)}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Management Custom Tasks -->
        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">المهام المضافة من الإدارة</h3>
            </div>
            <div id="mgmtTasks-${deptKey}">
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <h3>لا توجد مهام مضافة بعد</h3>
                    <p>يمكنك إضافة مهام مخصصة لهذا القسم</p>
                    <button class="btn btn-primary" onclick="addDepartmentTask('${deptKey}')">
                        <i class="fas fa-plus"></i>
                        إضافة أول مهمة
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ====== ADD DEPARTMENT TASK (modal stub) ======
function addDepartmentTask(deptKey) {
    const dept = departmentsData[deptKey];
    const title = dept ? dept.title : deptKey;
    alert(`سيتم فتح نافذة إضافة مهمة جديدة لـ: ${title}`);
}
