// ====== GLOBAL STATE ======
let currentPage = 'dashboard';
let sidebarCollapsed = false;

// ====== PARTNER ACCOUNTS & PROFILES ======
const PARTNERS = {
    'alaa': {
        name: 'علاء يوسف',
        shortName: 'علاء',
        initials: 'ع ي',
        role: 'Chief Strategic Advisor & Roastmaster',
        shortRole: 'Chief Strategic Advisor'
    },
    'joud': {
        name: 'جود القصير',
        shortName: 'جود',
        initials: 'ج ق',
        role: 'Chief Executive Officer & CMO',
        shortRole: 'Chief Executive Officer'
    },
    'abdullah': {
        name: 'عبد الله القصير',
        shortName: 'عبدالله',
        initials: 'ع ق',
        role: 'Chief Operating Officer',
        shortRole: 'Chief Operating Officer'
    },
    'anas': {
        name: 'أنس الصفدي',
        shortName: 'أنس',
        initials: 'أ ص',
        role: 'Chief Financial Officer',
        shortRole: 'Chief Financial Officer'
    }
};

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function () {
    initializeSidebar();
    initializeDateTime();
    initializeUserDropdown();
    loadPage('dashboard');
    setInterval(updateDateTime, 1000);
});

// ====== SIDEBAR & WORKSPACE PANELS ======
function initializeSidebar() {
    const sidebar        = document.getElementById('sidebar');
    const toggleBtn      = document.getElementById('toggleSidebar');
    const mobileToggle   = document.getElementById('toggleSidebarMobile');
    const togglePanelBtn = document.getElementById('toggleRightPanel');
    const sidePanel      = document.getElementById('sidePanel');
    const navPageItems   = document.querySelectorAll('.nav-item[data-page]');
    const expandables    = document.querySelectorAll('.nav-item.expandable');

    // Desktop Toggle collapse
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            sidebarCollapsed = sidebar.classList.contains('collapsed');
        });
    }

    // Mobile Sidebar Toggle
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }

    // Right Side Panel / Drawer Toggle
    if (togglePanelBtn && sidePanel) {
        togglePanelBtn.addEventListener('click', () => {
            sidePanel.classList.toggle('open');
        });
    }

    // Shift Pills in Right Panel
    document.querySelectorAll('.shift-pill').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.shift-pill').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Quick Dept Select in Right Panel
    const quickDept = document.getElementById('quickDeptSelect');
    if (quickDept) {
        quickDept.addEventListener('change', function () {
            if (this.value !== 'all') {
                loadPage(this.value);
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                const activeNav = document.getElementById('nav-' + this.value.replace('dept-', ''));
                if (activeNav) activeNav.classList.add('active');
            }
        });
    }

    // Expandable submenus
    expandables.forEach(item => {
        item.addEventListener('click', function () {
            if (sidebarCollapsed) return;
            const submenuId = this.id.replace('Toggle', 'Submenu');
            const submenu   = document.getElementById(submenuId);
            if (!submenu) return;

            // Close others
            document.querySelectorAll('.nav-submenu').forEach(m => {
                if (m.id !== submenuId) {
                    m.classList.remove('show');
                    const t = document.getElementById(m.id.replace('Submenu', 'Toggle'));
                    if (t) t.classList.remove('expanded');
                }
            });

            submenu.classList.toggle('show');
            this.classList.toggle('expanded');
        });
    });

    // Page navigation
    navPageItems.forEach(item => {
        item.addEventListener('click', function () {
            const page = this.getAttribute('data-page');
            loadPage(page);
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            // Close mobile sidebar if open
            if (sidebar) sidebar.classList.remove('mobile-open');
        });
    });

    // Top Search Input Hook
    const topSearchInput = document.getElementById('topSearchInput');
    if (topSearchInput) {
        topSearchInput.addEventListener('input', function () {
            const query = this.value.trim();
            if (currentPage === 'org-chart' && typeof searchBlueprint === 'function') {
                searchBlueprint(query);
            } else if (currentPage === '40-tasks' && typeof filterTasksByText === 'function') {
                filterTasksByText(query);
            }
        });
    }
}

// ====== DATE & TIME + DYNAMIC TIME-AWARE GREETING (Western Numerals Lock) ======
function initializeDateTime() { updateDateTime(); }

function updateDateTime() {
    const now = new Date();
    const partnerKey = localStorage.getItem('ror_active_partner') || 'alaa';
    const partner = PARTNERS[partnerKey] || PARTNERS['alaa'];
    const hour = now.getHours();

    let greetingText = '';
    let greetingIcon = 'fa-sun text-amber';

    if (hour >= 5 && hour < 12) {
        greetingText = `صباح مبارك، ${partner.shortName}`;
        greetingIcon = 'fa-sun text-amber';
    } else if (hour >= 12 && hour < 16) {
        greetingText = `ظهرًا مباركًا، ${partner.shortName}`;
        greetingIcon = 'fa-sun text-amber';
    } else {
        greetingText = `مساء مبارك، ${partner.shortName}`;
        greetingIcon = 'fa-moon text-indigo';
    }

    const greetingTextEl = document.getElementById('greetingText');
    const greetingIconEl = document.getElementById('greetingIcon');
    if (greetingTextEl) greetingTextEl.textContent = greetingText;
    if (greetingIconEl) greetingIconEl.className = `fas ${greetingIcon}`;

    // Live formatted date and time with Western Numerals (0-9)
    const dateFormatted = now.toLocaleDateString('ar-SA-u-nu-latn', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const timeFormatted = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });

    const dateTimeEl = document.getElementById('dateTime');
    if (dateTimeEl) {
        dateTimeEl.textContent = `${dateFormatted} | الوقت الحالي: ${timeFormatted}`;
    }
}

// ====== USER PROFILE & MULTI-PARTNER ACCOUNT SWITCHER ======
function initializeUserDropdown() {
    const menuWrap   = document.getElementById('userProfileMenuWrap');
    const triggerBtn = document.getElementById('userMenuBtn');
    const popover    = document.getElementById('userDropdownPopover');
    if (!triggerBtn || !popover) return;

    function updateActivePartnerUI(partnerKey) {
        const partner = PARTNERS[partnerKey] || PARTNERS['alaa'];
        const userTopAvatar = document.getElementById('userTopAvatar');
        const userTopName   = document.getElementById('userTopName');
        const userTopRole   = document.getElementById('userTopRole');
        const popoverAvatar = document.getElementById('popoverAvatar');
        const popoverName   = document.getElementById('popoverName');
        const popoverRole   = document.getElementById('popoverRole');

        if (userTopAvatar) userTopAvatar.textContent = partner.initials;
        if (userTopName)   userTopName.textContent   = partner.name;
        if (userTopRole)   userTopRole.textContent   = partner.shortRole;
        if (popoverAvatar) popoverAvatar.textContent = partner.initials;
        if (popoverName)   popoverName.textContent   = partner.name;
        if (popoverRole)   popoverRole.textContent   = partner.role;

        document.querySelectorAll('.partner-switch-item').forEach(item => {
            if (item.getAttribute('data-partner') === partnerKey) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        updateDateTime();
    }

    // Load saved partner
    const savedPartner = localStorage.getItem('ror_active_partner') || 'alaa';
    updateActivePartnerUI(savedPartner);

    triggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = popover.classList.contains('show');
        popover.classList.toggle('show');
        triggerBtn.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', (e) => {
        if (menuWrap && !menuWrap.contains(e.target)) {
            popover.classList.remove('show');
            triggerBtn.setAttribute('aria-expanded', 'false');
        }
    });

    document.querySelectorAll('.partner-switch-item').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const partnerKey = this.getAttribute('data-partner');
            if (partnerKey && PARTNERS[partnerKey]) {
                localStorage.setItem('ror_active_partner', partnerKey);
                updateActivePartnerUI(partnerKey);
                popover.classList.remove('show');
                triggerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// ====== PAGE LOADER ======
function loadPage(page) {
    currentPage = page;
    const contentArea = document.getElementById('contentArea');
    const pageTitle   = document.getElementById('pageTitle');

    const pages = {
        'dashboard':              { title: 'لوحة التحكم الرئيسية',                        fn: getDashboardContent },
        'kpi-dashboard':          { title: 'لوحة المؤشرات والأداء',                       fn: getKPIDashboardContent },
        'weekly-plan':            { title: 'الخطة الأسبوعية',                              fn: getWeeklyPlanContent },
        '40-tasks':               { title: 'خطة الـ 40 مهمة',                             fn: get40TasksContent },
        'menu-engineering':       { title: 'هندسة القائمة',                                fn: getMenuEngineeringContent },
        'breakeven':              { title: 'نقطة التعادل',                                 fn: getBreakevenContent },
        'raci-matrix':            { title: 'مصفوفة المسؤوليات (RACI)',                     fn: getRACIMatrixContent },
        'waste-cashflow':         { title: 'الهدر والسيولة',                               fn: getWasteCashflowContent },
        'vision-dashboard':       { title: 'الرؤية الانتقالية ولوحة الأداء المالي',        fn: getVisionDashboardContent },
        'financial-commitments':  { title: 'حصر الالتزامات والمصاريف المالية',             fn: getFinancialCommitmentsContent },
        'cafe-sales':             { title: 'تقارير مبيعات المقهى (البار)',                 fn: getCafeSalesContent },
        'roastery-sales':         { title: 'تقارير مبيعات المحمصة',                        fn: getRoasterySalesContent },
        'revolution-plan':        { title: 'خطة ثورة RoR التنفيذية',                      fn: getRevolutionPlanContent },
        'dept-production':        { title: 'قسم المحمصة والإنتاج',                        fn: () => getDepartmentContent('production') },
        'dept-quality':           { title: 'قسم ضبط الجودة والبحث والتطوير',              fn: () => getDepartmentContent('quality') },
        'dept-marketing':         { title: 'قسم التسويق والعلامة التجارية',               fn: () => getDepartmentContent('marketing') },
        'dept-sales':             { title: 'قسم المبيعات وتطوير الأعمال',                 fn: () => getDepartmentContent('sales') },
        'dept-ecommerce':         { title: 'قسم التجارة الإلكترونية واللوجستيات',          fn: () => getDepartmentContent('ecommerce') },
        'dept-maintenance':       { title: 'قسم الصيانة والدعم الفني',                    fn: () => getDepartmentContent('maintenance') },
        'dept-hr':                { title: 'قسم الموارد البشرية',                         fn: () => getDepartmentContent('hr') },
        'dept-finance':           { title: 'قسم المالية',                                  fn: () => getDepartmentContent('finance') },
        'dept-procurement':       { title: 'قسم المشتريات والتوريد وسلاسل الإمداد',       fn: () => getDepartmentContent('procurement') },
        'org-chart':              { title: 'الهيكل التنظيمي',                              fn: getOrgChartContent },
        'team-roles':             { title: 'مهام فريق RoR',                               fn: getTeamRolesContent },
        'mind-map':               { title: 'الخريطة الذهنية للفريق',                       fn: getMindMapContent },
        'development':            { title: 'التطوير والنمو',                               fn: getDevelopmentContent }
    };

    const pageData = pages[page] || pages['dashboard'];
    pageTitle.textContent   = pageData.title;
    contentArea.innerHTML   = pageData.fn();

    // Specific post-render initialization
    if (page === 'org-chart' && typeof refreshOrgCardsFromStorage === 'function') {
        refreshOrgCardsFromStorage();
    }

    // Initialize chart logic after DOM update
    if (typeof initializePageSpecific === 'function') {
        initializePageSpecific(page);
    }
}

// ========================================================
// ==================  PAGE CONTENT  ======================
// ========================================================

// ====== DASHBOARD ======
function getDashboardContent() {
    return `
        <div class="page-header">
            <h2 class="page-title">مرحباً بك في نظام RoR التشغيلي</h2>
            <p class="page-subtitle">نظرة شاملة على الأداء والعمليات — ${new Date().toLocaleDateString('ar-SA', {year:'numeric',month:'long',day:'numeric'})}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header">
                    <span class="stat-title">مبيعات اليوم</span>
                    <div class="stat-icon primary"><i class="fas fa-dollar-sign"></i></div>
                </div>
                <div class="stat-value">2,450 ريال</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>12% عن الأمس</span></div>
            </div>
            <div class="stat-card success">
                <div class="stat-header">
                    <span class="stat-title">عدد الطلبات</span>
                    <div class="stat-icon success"><i class="fas fa-shopping-cart"></i></div>
                </div>
                <div class="stat-value">87 طلب</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>8% عن الأمس</span></div>
            </div>
            <div class="stat-card warning">
                <div class="stat-header">
                    <span class="stat-title">متوسط الفاتورة</span>
                    <div class="stat-icon warning"><i class="fas fa-receipt"></i></div>
                </div>
                <div class="stat-value">28 ريال</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>4% عن الأمس</span></div>
            </div>
            <div class="stat-card danger">
                <div class="stat-header">
                    <span class="stat-title">المخزون المنخفض</span>
                    <div class="stat-icon danger"><i class="fas fa-exclamation-triangle"></i></div>
                </div>
                <div class="stat-value">5 منتجات</div>
                <div class="stat-change negative"><i class="fas fa-arrow-down"></i> <span>يحتاج إعادة طلب</span></div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title">مبيعات الأسبوع (ريال)</h3></div>
                <div class="chart-container"><canvas id="weekSalesChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title">توزيع المنتجات</h3></div>
                <div class="chart-container"><canvas id="productDistChart"></canvas></div>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">آخر العمليات</h3>
                <button class="btn btn-outline" id="viewAllOpsBtn"><i class="fas fa-eye"></i> عرض الكل</button>
            </div>
            <div class="table-responsive">
                <table>
                    <thead><tr><th>الوقت</th><th>النشاط</th><th>القسم</th><th>المسؤول</th><th>الحالة</th></tr></thead>
                    <tbody>
                        <tr><td>10:30 ص</td><td>تحميص دفعة جديدة - إثيوبيا</td><td>المحمصة</td><td>علاء يوسف</td><td><span class="badge success">مكتمل</span></td></tr>
                        <tr><td>11:15 ص</td><td>طلب جملة - 20 كيلو</td><td>المبيعات</td><td>أبو محمد</td><td><span class="badge warning">قيد المعالجة</span></td></tr>
                        <tr><td>12:00 ظ</td><td>تحديث القائمة الموسمية</td><td>البار</td><td>عارف</td><td><span class="badge success">مكتمل</span></td></tr>
                        <tr><td>01:30 ع</td><td>صيانة ماكينة الإسبريسو</td><td>الصيانة</td><td>علم</td><td><span class="badge info">جاري العمل</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="alert warning">
            <i class="fas fa-exclamation-circle"></i>
            <div><strong>تنبيه:</strong> يوجد 3 مهام متأخرة تحتاج إلى متابعة فورية</div>
        </div>
    `;
}

// ====== KPI DASHBOARD ======
function getKPIDashboardContent() {
    return `
        <div class="page-header">
            <h2 class="page-title">مؤشرات الأداء الرئيسية (KPIs)</h2>
            <p class="page-subtitle">تتبع دقيق لأهم مقاييس الأداء المالي والتشغيلي</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header"><span class="stat-title">إجمالي المبيعات (شهري)</span><div class="stat-icon primary"><i class="fas fa-chart-line"></i></div></div>
                <div class="stat-value">68,500 ريال</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>15% عن الشهر الماضي</span></div>
            </div>
            <div class="stat-card success">
                <div class="stat-header"><span class="stat-title">هامش الربح الإجمالي</span><div class="stat-icon success"><i class="fas fa-percentage"></i></div></div>
                <div class="stat-value">42%</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>3% تحسن</span></div>
            </div>
            <div class="stat-card warning">
                <div class="stat-header"><span class="stat-title">التكاليف التشغيلية</span><div class="stat-icon warning"><i class="fas fa-wallet"></i></div></div>
                <div class="stat-value">32,400 ريال</div>
                <div class="stat-change negative"><i class="fas fa-arrow-up"></i> <span>5% زيادة</span></div>
            </div>
            <div class="stat-card info">
                <div class="stat-header"><span class="stat-title">صافي الربح</span><div class="stat-icon success"><i class="fas fa-money-bill-wave"></i></div></div>
                <div class="stat-value">12,850 ريال</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>18% تحسن</span></div>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">المؤشرات التشغيلية</h3></div>
            ${[
                { label: 'كفاءة الإنتاج', val: 85 },
                { label: 'رضا العملاء', val: 92 },
                { label: 'معدل دوران المخزون', val: 78 },
                { label: 'إنتاجية الموظفين', val: 88 }
            ].map(k => `
                <div class="progress-container">
                    <div class="progress-label"><span>${k.label}</span><span>${k.val}%</span></div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${k.val}%"></div></div>
                </div>
            `).join('')}
        </div>

        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title">اتجاه المبيعات (6 أشهر)</h3></div>
                <div class="chart-container"><canvas id="salesTrendChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title">مقارنة الإيرادات والتكاليف</h3></div>
                <div class="chart-container"><canvas id="revenueCostChart"></canvas></div>
            </div>
        </div>
    `;
}

// ====== WEEKLY PLAN ======
function getWeeklyPlanContent() {
    const tasks = [
        { title: 'تحميص 50 كيلو - خليط المنزل',        days: 'الأحد - الاثنين', owner: 'علاء يوسف',    priority: 'high',   done: false },
        { title: 'متابعة طلبات الجملة المعلقة',          days: 'الاثنين',         owner: 'أبو محمد',     priority: 'medium', done: true },
        { title: 'تحديث حسابات Instagram و TikTok',      days: 'يومي',            owner: 'قسم التسويق',  priority: 'high',   done: false },
        { title: 'جرد المخزون الشهري',                    days: 'الخميس',          owner: 'جود',          priority: 'medium', done: false },
        { title: 'صيانة دورية للمعدات',                   days: 'الجمعة',          owner: 'علم',          priority: 'low',    done: false }
    ];
    const done = tasks.filter(t => t.done).length;
    const pct  = Math.round((done / tasks.length) * 100);

    return `
        <div class="page-header">
            <h2 class="page-title">الخطة الأسبوعية</h2>
            <p class="page-subtitle">الأسبوع الحالي — مارس 2024</p>
        </div>

        <div class="alert info">
            <i class="fas fa-info-circle"></i>
            <div><strong>ملاحظة:</strong> يتم تحديث الخطة الأسبوعية كل يوم أحد</div>
        </div>

        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">مهام هذا الأسبوع</h3>
                <button class="btn btn-primary" id="addWeeklyTaskBtn" onclick="alert('سيتم فتح نافذة إضافة مهمة')">
                    <i class="fas fa-plus"></i> إضافة مهمة
                </button>
            </div>
            <div class="task-list">
                ${tasks.map((t, i) => `
                    <div class="task-item">
                        <input type="checkbox" class="task-checkbox" id="wt-${i}" ${t.done ? 'checked' : ''} aria-label="${t.title}">
                        <div class="task-content">
                            <div class="task-title" style="${t.done ? 'text-decoration:line-through;opacity:0.6' : ''}">${t.title}</div>
                            <div class="task-meta">
                                <span><i class="fas fa-calendar"></i> ${t.days}</span>
                                <span><i class="fas fa-user"></i> ${t.owner}</span>
                                <span class="task-priority ${t.priority}">${getPriorityText(t.priority)}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">إنجاز المهام الأسبوعية</h3></div>
            <div class="progress-container">
                <div class="progress-label">
                    <span>تم إنجاز ${done} من ${tasks.length} مهام</span>
                    <span>${pct}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width:${pct}%"></div>
                </div>
            </div>
        </div>
    `;
}

// ====== 40 TASKS (OFFICIAL 8-WEEK OPERATIONAL BLUEPRINT) ======
function get40TasksContent() {
    const defaultTasks = [
        { id: 1, week: 1, task: "حصر جميع الأصول الثابتة والمعدات وتوثيق الضمانات لمقهى RoR.", cat: "مالية وتكاليف", status: "completed", responsible: "علاء" },
        { id: 2, week: 1, task: "إدخال بيانات الموردين الحاليين وتثبيت شروط الدفع والائتمان.", cat: "مالية وتكاليف", status: "completed", responsible: "أنس" },
        { id: 3, week: 1, task: "إعداد وتدقيق قائمة المكونات الأولية (Raw Materials) لجميع المشروبات والأطباق.", cat: "تشغيلية", status: "completed", responsible: "عبدالله" },
        { id: 4, week: 1, task: "تعيين أسعار التكلفة المعيارية (Standard Recipe Cost) للمشروبات والوجبات الرئيسية.", cat: "مالية وتكاليف", status: "completed", responsible: "علاء" },
        { id: 5, week: 1, task: "ضبط أرصدة المخزون الافتتاحية للمستودع الرئيسي والثلاجات الفرعية.", cat: "تشغيلية", status: "completed", responsible: "عبدالله" },
        { id: 6, week: 2, task: "توزيع المهام التشغيلية اليومية لموظفي صالة RoR والبارتندرز والمطبخ.", cat: "تشغيلية", status: "completed", responsible: "عبدالله" },
        { id: 7, week: 2, task: "تفعيل مصفوفة المسؤوليات (RACI) وتحديد من يملك القرار النهائي لكل قسم.", cat: "حوكمة", status: "completed", responsible: "علاء" },
        { id: 8, week: 2, task: "إعداد كتيب الموظف الداخلي (Employee Handbook) وتوضيح معايير خدمة RoR.", cat: "حوكمة", status: "completed", responsible: "أنس" },
        { id: 9, week: 2, task: "جدولة فترات العمل (Shift Schedule) وتوزيع ساعات الذروة والهدوء أسبوعياً.", cat: "تشغيلية", status: "completed", responsible: "عبدالله" },
        { id: 10, week: 2, task: "تفعيل نظام تقييم الأداء الأسبوعي الأولي لفريق الخدمة والتحضير.", cat: "جودة وتطوير", status: "completed", responsible: "علاء" },
        { id: 11, week: 3, task: "توثيق إجراءات التحضير المسبق (Prep Sheet) لخط الإنتاج الساخن والبارد.", cat: "تشغيلية", status: "completed", responsible: "عبدالله" },
        { id: 12, week: 3, task: "إطلاق سجل تتبع الهدر اليومي (Daily Waste Log) في المطبخ والبار.", cat: "جودة وتطوير", status: "completed", responsible: "علاء" },
        { id: 13, week: 3, task: "تحديد الحد الأعلى والحد الأدنى للطلب (Min/Max Par Levels) لكل صنف بالمخزن.", cat: "تشغيلية", status: "completed", responsible: "عبدالله" },
        { id: 14, week: 3, task: "فحص وضبط معايير معايرة المكائن (Espresso Calibration, Grinder, Ovens).", cat: "جودة وتطوير", status: "completed", responsible: "علاء" },
        { id: 15, week: 3, task: "تطبيق آلية التدقيق على الاستلام ودرجات حرارة الأغذية الواردة.", cat: "جودة وتطوير", status: "completed", responsible: "عبدالله" },
        { id: 16, week: 4, task: "ربط وتحليل بيانات نظام البيع (POS) لاستخراج حجم المبيعات الفعلي للأسابيع الماضية.", cat: "مالية وتكاليف", status: "completed", responsible: "أنس" },
        { id: 17, week: 4, task: "تصنيف أصناف المنيو في جدول أولي وفق هندسة القائمة (Stars, Puzzles, Plowhorses, Dogs).", cat: "تسويقية", status: "completed", responsible: "علاء" },
        { id: 18, week: 4, task: "مراجعة أسعار بيع المشروبات الأكثر طلباً بـ RoR ومقارنتها بأسعار المنافسين.", cat: "تسويقية", status: "completed", responsible: "جود" },
        { id: 19, week: 4, task: "حساب هامش الربح الإجمالي (Gross Margin) لكل تصنيف في منيو RoR الحالي.", cat: "مالية وتكاليف", status: "completed", responsible: "أنس" },
        { id: 20, week: 4, task: "اتخاذ قرار مبدئي بشأن تعديل أسعار بيع الأصناف أو استبدال الأصناف الضعيفة.", cat: "حوكمة", status: "completed", responsible: "علاء" },
        { id: 21, week: 5, task: "مراجعة حركة النقد اليومية (Daily Cash Flow Drop) ومطابقتها مع تقارير المبيعات.", cat: "مالية وتكاليف", status: "completed", responsible: "أنس" },
        { id: 22, week: 5, task: "جدولة فواتير الموردين المستحقة وتوزيع دفعاتها لتجنب انقطاع التوريد.", cat: "مالية وتكاليف", status: "completed", responsible: "أنس" },
        { id: 23, week: 5, task: "حصر الذمم المدينة (مبيعات الشركات/الفعاليات لـ RoR) ومتابعة تحصيل المدفوعات.", cat: "مبيعات وجملة", status: "completed", responsible: "جود" },
        { id: 24, week: 5, task: "إنشاء صندوق النثرية (Petty Cash) وتحديد صلاحيات صرفه وتوثيق فواتيره السريعة.", cat: "مالية وتكاليف", status: "completed", responsible: "أنس" },
        { id: 25, week: 5, task: "تحليل المصاريف التشغيلية الثابتة والمتغيرة وربطها بنقطة التعادل المستهدفة.", cat: "مالية وتكاليف", status: "completed", responsible: "علاء" },
        { id: 26, week: 6, task: "تطبيق قائمة التدقيق البيئية والصحية والبلدية الداخلية بـ RoR.", cat: "جودة وتطوير", status: "completed", responsible: "عبدالله" },
        { id: 27, week: 6, task: "تفعيل منبه التراخيص القانونية والصحية وفترات تجديد سجلات وتراخيص مقهى RoR.", cat: "حوكمة", status: "completed", responsible: "أنس" },
        { id: 28, week: 6, task: "إجراء فحص سري للمتسوق الخفي (Mystery Shopper) لتقييم كفاءة الخدمة وسرعتها.", cat: "جودة وتطوير", status: "completed", responsible: "جود" },
        { id: 29, week: 6, task: "مراجعة شكاوى وملاحظات العملاء على منصات التقييم (Google Maps / Social Media).", cat: "تسويقية", status: "completed", responsible: "جود" },
        { id: 30, week: 6, task: "تدريب فريق العمل بـ RoR على سيناريوهات التعامل مع ضغط العمل وشكاوى العملاء المباشرة.", cat: "تشغيلية", status: "completed", responsible: "عبدالله" },
        { id: 31, week: 7, task: "حساب تكلفة الغذاء الفعلية (Actual Food Cost) ومقارنتها بالمعيارية المخطط لها.", cat: "مالية وتكاليف", status: "completed", responsible: "علاء" },
        { id: 32, week: 7, task: "احتساب تكلفة العمالة الإجمالية (Labor Cost %) كنسبة مئوية من المبيعات الفعلية.", cat: "مالية وتكاليف", status: "completed", responsible: "أنس" },
        { id: 33, week: 7, task: "تحديد التكلفة الأساسية (Prime Cost) والتأكد من أنها ضمن النطاق المالي الآمن (<60%).", cat: "مالية وتكاليف", status: "in-progress", responsible: "علاء" },
        { id: 34, week: 7, task: "إعداد تقرير التباين الأسبوعي (Variance Report) بين الاستهلاك الفعلي والمعياري للمواد.", cat: "جودة وتطوير", status: "in-progress", responsible: "عبدالله" },
        { id: 35, week: 7, task: "وضع خطة عمل فورية لمعالجة الفروقات في المواد المرتفعة التكلفة.", cat: "تشغيلية", status: "pending", responsible: "علاء" },
        { id: 36, week: 8, task: "تطوير لوحة قيادة الأداء النهائية (Final Performance Dashboard) الشاملة لجميع المؤشرات.", cat: "حوكمة", status: "pending", responsible: "علاء" },
        { id: 37, week: 8, task: "عرض التقرير المالي النهائي ومقارنة النتائج الفعلية بالأهداف المستهدفة بـ RoR.", cat: "مالية وتكاليف", status: "pending", responsible: "أنس" },
        { id: 38, week: 8, task: "تثبيت مصفوفة الصلاحيات الدائمة (Final RACI) وتحديث الوصف الوظيفي لجميع العاملين.", cat: "حوكمة", status: "pending", responsible: "عبدالله" },
        { id: 39, week: 8, task: "تسليم أدلة التشغيل القياسية المحدثة (SOPs) لمدراء الفروع والورديات.", cat: "تشغيلية", status: "pending", responsible: "علاء" },
        { id: 40, week: 8, task: "عقد اجتماع الإغلاق والتقييم النهائي مع الإدارة واعتماد خطة التوسع المستقبلية.", cat: "حوكمة", status: "pending", responsible: "علاء" }
    ];

    const completedCount = defaultTasks.filter(t => t.status === 'completed').length;
    const inProgressCount = defaultTasks.filter(t => t.status === 'in-progress').length;
    const pendingCount = defaultTasks.filter(t => t.status === 'pending').length;
    const progressPct = Math.round((completedCount / defaultTasks.length) * 100);

    return `
        <div class="page-header">
            <h2 class="page-title">خطة الـ 40 مهمة التشغيلية المعتمدة</h2>
            <p class="page-subtitle">خارطة طريق التطوير وإعادة الهيكلة الشاملة لمقهى ومحمصة RoR (مقسمة على 8 أسابيع)</p>
        </div>

        <!-- KPI Summary Cards -->
        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header">
                    <span class="stat-title">إجمالي المهام المعتمدة</span>
                    <div class="stat-icon primary"><i class="fas fa-list-check"></i></div>
                </div>
                <div class="stat-value">40 مهمة</div>
                <div class="stat-change"><span>8 أسابيع تشغيلية متتالية</span></div>
            </div>
            <div class="stat-card success">
                <div class="stat-header">
                    <span class="stat-title">المهام المنجزة بنجاح</span>
                    <div class="stat-icon success"><i class="fas fa-circle-check"></i></div>
                </div>
                <div class="stat-value">${completedCount} مهمة</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>${progressPct}% نسبة الإنجاز</span></div>
            </div>
            <div class="stat-card warning">
                <div class="stat-header">
                    <span class="stat-title">مهام قيد التنفيذ</span>
                    <div class="stat-icon warning"><i class="fas fa-spinner"></i></div>
                </div>
                <div class="stat-value">${inProgressCount} مهام</div>
                <div class="stat-change"><span>الأسبوع 7 (التكلفة الأساسية والتباين)</span></div>
            </div>
            <div class="stat-card info">
                <div class="stat-header">
                    <span class="stat-title">المهام المجدولة المتبقية</span>
                    <div class="stat-icon primary"><i class="fas fa-calendar-check"></i></div>
                </div>
                <div class="stat-value">${pendingCount} مهام</div>
                <div class="stat-change"><span>الأسبوع 8 (الإغلاق والتسليم النهائي)</span></div>
            </div>
        </div>

        <!-- Overall Progress Bar -->
        <div class="table-card" style="padding:1.25rem 1.5rem;margin-bottom:1.5rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;">
                <span style="font-weight:700;font-size:0.92rem;color:#0F172A;"><i class="fas fa-chart-line" style="color:#0284C7;margin-left:6px;"></i> شريط التقدم التشغيلي التراكمي للخطة</span>
                <span style="font-weight:800;font-size:1.05rem;color:#0284C7;">${progressPct}%</span>
            </div>
            <div class="progress-bar-bg" style="height:10px;">
                <div class="progress-bar-fill" style="width:${progressPct}%;background:linear-gradient(90deg, #0284C7, #10B981);"></div>
            </div>
        </div>

        <!-- Tasks Filter & Table -->
        <div class="table-card">
            <div class="table-header">
                <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                    <h3 class="table-title">سجل الـ 40 مهمة المفصل</h3>
                    <div class="filter-pills-group" id="tasksWeekFilterGroup">
                        <button class="filter-pill-btn active" onclick="filter40Tasks('all', this)">الكل (40)</button>
                        <button class="filter-pill-btn" onclick="filter40Tasks('w1-2', this)">الأسابيع 1-2 (10)</button>
                        <button class="filter-pill-btn" onclick="filter40Tasks('w3-4', this)">الأسابيع 3-4 (10)</button>
                        <button class="filter-pill-btn" onclick="filter40Tasks('w5-6', this)">الأسابيع 5-6 (10)</button>
                        <button class="filter-pill-btn" onclick="filter40Tasks('w7-8', this)">الأسابيع 7-8 (10)</button>
                    </div>
                </div>
                <div style="display:flex;gap:10px;align-items:center;">
                    <div class="org-search-box" style="min-width:200px;">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" id="taskSearchInput" placeholder="بحث في المهام..." oninput="filterTasksByText(this.value)">
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table id="tasksTable">
                    <thead>
                        <tr>
                            <th style="width:60px;">#</th>
                            <th style="width:100px;">الأسبوع</th>
                            <th>المهمة التشغيلية</th>
                            <th style="width:140px;">الفئة</th>
                            <th style="width:120px;">المسؤول</th>
                            <th style="width:130px;">الحالة</th>
                        </tr>
                    </thead>
                    <tbody id="tasksTableBody">
                        ${defaultTasks.map(t => {
                            const statusLabel = t.status === 'completed' ? 'مكتمل' : t.status === 'in-progress' ? 'قيد التنفيذ' : 'مجدول';
                            const statusClass = t.status === 'completed' ? 'badge-green' : t.status === 'in-progress' ? 'badge-blue' : 'badge-warning';
                            const statusIcon  = t.status === 'completed' ? 'fa-check' : t.status === 'in-progress' ? 'fa-spinner fa-spin' : 'fa-clock';
                            return `
                                <tr data-week="${t.week}" data-status="${t.status}" data-cat="${t.cat}">
                                    <td style="font-weight:700;color:#64748B;">#${t.id}</td>
                                    <td><span class="badge badge-oxford" style="font-weight:600;">الأسبوع ${t.week}</span></td>
                                    <td style="font-weight:600;color:#0F172A;">${t.task}</td>
                                    <td><span class="badge badge-subtle" style="font-size:0.75rem;">${t.cat}</span></td>
                                    <td><strong style="color:#0284C7;"><i class="fas fa-user-circle" style="margin-left:4px;"></i>${t.responsible}</strong></td>
                                    <td><span class="badge ${statusClass}"><i class="fas ${statusIcon}" style="margin-left:4px;"></i>${statusLabel}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Interactive 40 Tasks filtering
window.filter40Tasks = function(filter, btn) {
    document.querySelectorAll('#tasksWeekFilterGroup .filter-pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const rows = document.querySelectorAll('#tasksTableBody tr');
    rows.forEach(r => {
        const week = parseInt(r.dataset.week);
        let show = true;
        if (filter === 'w1-2') show = (week === 1 || week === 2);
        else if (filter === 'w3-4') show = (week === 3 || week === 4);
        else if (filter === 'w5-6') show = (week === 5 || week === 6);
        else if (filter === 'w7-8') show = (week === 7 || week === 8);
        r.style.display = show ? '' : 'none';
    });
};

window.filterTasksByText = function(query) {
    const q = (query || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#tasksTableBody tr');
    rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = text.includes(q) ? '' : 'none';
    });
};

// ====== MENU ENGINEERING (OFFICIAL 2D MATRIX) ======
function getMenuEngineeringContent() {
    const menuItems = [
        { name: "V60 إثيوبي شلشلي", category: "مشروبات ساخنة", price: 18.0, cost: 4.5, popularity: 8, contribution: 75.0, classType: "stars", label: "نجم (Star)", badge: "badge-green", icon: "fa-star" },
        { name: "فلات وايت RoR", category: "مشروبات ساخنة", price: 15.0, cost: 3.8, popularity: 9, contribution: 74.6, classType: "stars", label: "نجم (Star)", badge: "badge-green", icon: "fa-star" },
        { name: "قهوة اليوم كولومبي", category: "مشروبات ساخنة", price: 9.0, cost: 1.8, popularity: 10, contribution: 80.0, classType: "stars", label: "نجم (Star)", badge: "badge-green", icon: "fa-star" },
        { name: "سبانش لاتيه RoR", category: "مشروبات ساخنة", price: 19.0, cost: 5.5, popularity: 8, contribution: 71.1, classType: "stars", label: "نجم (Star)", badge: "badge-green", icon: "fa-star" },
        { name: "كولد برو مقطر RoR", category: "مشروبات باردة", price: 21.0, cost: 5.2, popularity: 6, contribution: 75.2, classType: "puzzles", label: "لغز (Puzzle)", badge: "badge-blue", icon: "fa-circle-question" },
        { name: "كيكة التمر بالكراميل", category: "حلويات ومخبوزات", price: 16.0, cost: 4.0, popularity: 5, contribution: 75.0, classType: "puzzles", label: "لغز (Puzzle)", badge: "badge-blue", icon: "fa-circle-question" },
        { name: "كورتادو كلاسيك", category: "مشروبات ساخنة", price: 14.0, cost: 3.2, popularity: 7, contribution: 77.1, classType: "plowhorses", label: "حصان (Plowhorse)", badge: "badge-warning", icon: "fa-horse" },
        { name: "شاي إنجليزي فاخر", category: "مشروبات ساخنة", price: 8.0, cost: 1.2, popularity: 3, contribution: 85.0, classType: "dogs", label: "منخفض (Dog)", badge: "badge-danger", icon: "fa-paw" }
    ];

    const starsCount = menuItems.filter(m => m.classType === 'stars').length;
    const plowCount = menuItems.filter(m => m.classType === 'plowhorses').length;
    const puzzlesCount = menuItems.filter(m => m.classType === 'puzzles').length;
    const dogsCount = menuItems.filter(m => m.classType === 'dogs').length;

    return `
        <div class="page-header">
            <h2 class="page-title">هندسة القائمة ومصفوفة الربحية (Menu Engineering)</h2>
            <p class="page-subtitle">المصفوفة الثنائية (2D Matrix) لتصنيف أصناف المنيو وفق الشعبية الميدانية وهامش المساهمة الربحي</p>
        </div>

        <!-- 4 Quadrants Summary Cards -->
        <div class="stats-grid">
            <div class="stat-card success">
                <div class="stat-header">
                    <span class="stat-title">النجوم (Stars)</span>
                    <div class="stat-icon success"><i class="fas fa-star"></i></div>
                </div>
                <div class="stat-value">${starsCount} أصناف</div>
                <div class="stat-change positive"><span>ربحية عالية + شعبية عالية</span></div>
                <p style="margin-top:0.65rem;font-size:0.78rem;color:#64748B;line-height:1.5;">
                    <strong>القرار التشغيلي:</strong> حماية الجودة بدقة، ثبات معايرة الاستخلاص، وتوفير محاصيلها دون انقطاع.
                </p>
            </div>

            <div class="stat-card warning">
                <div class="stat-header">
                    <span class="stat-title">الخيول (Plowhorses)</span>
                    <div class="stat-icon warning"><i class="fas fa-horse"></i></div>
                </div>
                <div class="stat-value">${plowCount} أصناف</div>
                <div class="stat-change"><span>شعبية عالية + ربحية معتدلة</span></div>
                <p style="margin-top:0.65rem;font-size:0.78rem;color:#64748B;line-height:1.5;">
                    <strong>القرار التشغيلي:</strong> تقليل تكاليف الحليب والأكواب أو رفع السعر بهدوء (+1 ر.س) لتعظيم العائد.
                </p>
            </div>

            <div class="stat-card info">
                <div class="stat-header">
                    <span class="stat-title">الألغاز (Puzzles)</span>
                    <div class="stat-icon primary"><i class="fas fa-circle-question"></i></div>
                </div>
                <div class="stat-value">${puzzlesCount} أصناف</div>
                <div class="stat-change"><span>ربحية عالية جداً + شعبية منخفضة</span></div>
                <p style="margin-top:0.65rem;font-size:0.78rem;color:#64748B;line-height:1.5;">
                    <strong>القرار التشغيلي:</strong> تفعيل أساليب البيع المقترح (Upselling) بواسطة الكاشير وعينات تذوق مجانية.
                </p>
            </div>

            <div class="stat-card danger">
                <div class="stat-header">
                    <span class="stat-title">الكلاب / المنخفضة (Dogs)</span>
                    <div class="stat-icon danger"><i class="fas fa-paw"></i></div>
                </div>
                <div class="stat-value">${dogsCount} صنف</div>
                <div class="stat-change"><span>شعبية ضعيفة + مساهمة محدودة</span></div>
                <p style="margin-top:0.65rem;font-size:0.78rem;color:#64748B;line-height:1.5;">
                    <strong>القرار التشغيلي:</strong> استبدال الصنف بخيار شاي مختص مميز أو شاي كرك يتماشى مع هوية RoR.
                </p>
            </div>
        </div>

        <!-- Menu Analysis Table -->
        <div class="table-card">
            <div class="table-header">
                <div>
                    <h3 class="table-title">جدول تحليل المنيو الشامل والتكاليف</h3>
                    <p style="margin:4px 0 0 0;font-size:0.8rem;color:#64748B;">بيانات مسعرة بالريال السعودي مع نسب هامش المساهمة الفعلي</p>
                </div>
                <div style="display:flex;gap:8px;">
                    <button class="btn btn-outline" onclick="window.print()"><i class="fas fa-print"></i> طباعة التقرير</button>
                </div>
            </div>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>الصنف</th>
                            <th>التصنيف</th>
                            <th>سعر البيع</th>
                            <th>التكلفة المعيارية</th>
                            <th>هامش الربح (المساهمة)</th>
                            <th>نسبة الهامش %</th>
                            <th>مؤشر الشعبية (1-10)</th>
                            <th>التصنيف الربحي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${menuItems.map(m => {
                            const margin = (m.price - m.cost).toFixed(2);
                            return `
                                <tr>
                                    <td style="font-weight:700;color:#0F172A;"><i class="fas fa-mug-hot" style="color:#0284C7;margin-left:6px;"></i>${m.name}</td>
                                    <td><span class="badge badge-subtle">${m.category}</span></td>
                                    <td style="font-weight:700;color:#0F172A;">${m.price.toFixed(2)} ر.س</td>
                                    <td style="color:#64748B;">${m.cost.toFixed(2)} ر.س</td>
                                    <td style="font-weight:800;color:#10B981;">+${margin} ر.س</td>
                                    <td style="font-weight:700;color:#0284C7;">${m.contribution.toFixed(1)}%</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:6px;">
                                            <span style="font-weight:700;width:18px;">${m.popularity}</span>
                                            <div class="progress-bar-bg" style="width:70px;height:6px;margin:0;">
                                                <div class="progress-bar-fill" style="width:${m.popularity * 10}%;background:#0284C7;"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span class="badge ${m.badge}"><i class="fas ${m.icon}" style="margin-left:4px;"></i>${m.label}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ====== BREAKEVEN ======
function getBreakevenContent() {
    const rows = [
        { goal:'التعادل (صفر ربح)',  monthly:'50,909', daily:'1,697', cups:'85' },
        { goal:'ربح 10,000 ريال',   monthly:'69,091', daily:'2,303', cups:'115' },
        { goal:'ربح 20,000 ريال',   monthly:'87,273', daily:'2,909', cups:'145' },
        { goal:'ربح 30,000 ريال',   monthly:'105,455',daily:'3,515', cups:'176' }
    ];
    return `
        <div class="page-header">
            <h2 class="page-title">نقطة التعادل (Break-Even Analysis)</h2>
            <p class="page-subtitle">تحديد الحد الأدنى من المبيعات لتغطية التكاليف</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header"><span class="stat-title">التكاليف الثابتة (شهرياً)</span><div class="stat-icon primary"><i class="fas fa-anchor"></i></div></div>
                <div class="stat-value">28,000 ريال</div>
                <ul style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-secondary);list-style:none;padding:0">
                    <li>• إيجار: 12,000</li><li>• رواتب: 10,000</li><li>• كهرباء: 3,000</li>
                    <li>• تأمينات: 2,000</li><li>• أخرى: 1,000</li>
                </ul>
            </div>
            <div class="stat-card warning">
                <div class="stat-header"><span class="stat-title">متوسط التكاليف المتغيرة</span><div class="stat-icon warning"><i class="fas fa-exchange-alt"></i></div></div>
                <div class="stat-value">45%</div>
                <p style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-secondary)">من سعر البيع (خامات، تغليف، شحن)</p>
            </div>
            <div class="stat-card success">
                <div class="stat-header"><span class="stat-title">هامش المساهمة</span><div class="stat-icon success"><i class="fas fa-percentage"></i></div></div>
                <div class="stat-value">55%</div>
                <p style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-secondary)">100% - 45% = 55%</p>
            </div>
            <div class="stat-card danger">
                <div class="stat-header"><span class="stat-title">نقطة التعادل (شهرياً)</span><div class="stat-icon danger"><i class="fas fa-balance-scale"></i></div></div>
                <div class="stat-value">50,909 ريال</div>
                <p style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-secondary)">28,000 ÷ 0.55 = 50,909</p>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">المبيعات المطلوبة لتحقيق الأهداف</h3></div>
            <div class="table-responsive">
                <table>
                    <thead><tr><th>الهدف</th><th>المبيعات المطلوبة (شهرياً)</th><th>المبيعات اليومية</th><th>عدد الأكواب (بمعدل 20 ريال)</th></tr></thead>
                    <tbody>
                        ${rows.map(r => `
                            <tr>
                                <td><strong>${r.goal}</strong></td>
                                <td>${r.monthly} ريال</td>
                                <td>${r.daily} ريال</td>
                                <td>${r.cups} كوب</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="alert warning">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <strong>الوضع الحالي:</strong> متوسط المبيعات اليومية = 2,450 ريال (أعلى من التعادل بـ 44%)<br>
                <strong>التوصية:</strong> العمل على زيادة المبيعات لتحقيق هامش ربح أفضل
            </div>
        </div>
    `;
}

// ====== RACI MATRIX ======
function getRACIMatrixContent() {
    const matrix = [
        { task:'التحميص والإنتاج',    alaa:'R, A', abu:'I',    joud:'I',   anas:'-',   aref:'C',    alm:'C' },
        { task:'ضبط الجودة',           alaa:'R, A', abu:'I',    joud:'I',   anas:'-',   aref:'C',    alm:'-' },
        { task:'مبيعات B2B',           alaa:'C',    abu:'R, A', joud:'I',   anas:'I',   aref:'-',    alm:'-' },
        { task:'الإدارة المالية',      alaa:'I',    abu:'I',    joud:'R',   anas:'A',   aref:'-',    alm:'-' },
        { task:'التسويق الرقمي',       alaa:'A',    abu:'C',    joud:'R',   anas:'I',   aref:'R',    alm:'R' },
        { task:'خدمة العملاء (البار)', alaa:'C',    abu:'I',    joud:'I',   anas:'-',   aref:'R, A', alm:'R, A' },
        { task:'صيانة المعدات',        alaa:'C',    abu:'I',    joud:'I',   anas:'-',   aref:'R',    alm:'R, A' },
        { task:'إدارة المخزون',        alaa:'C',    abu:'C',    joud:'R, A',anas:'I',   aref:'R',    alm:'R' },
        { task:'التقارير للشركاء',     alaa:'R',    abu:'I',    joud:'R',   anas:'A',   aref:'-',    alm:'-' },
        { task:'التطوير والابتكار',    alaa:'R, A', abu:'C',    joud:'C',   anas:'I',   aref:'C',    alm:'-' }
    ];

    function badge(val) {
        if (val === '-') return '<span style="color:var(--border-color)">—</span>';
        const cls = val.includes('A') ? 'success' : val.includes('R') ? 'info' : val.includes('C') ? 'warning' : 'danger';
        return `<span class="badge ${cls}">${val}</span>`;
    }

    return `
        <div class="page-header">
            <h2 class="page-title">مصفوفة المسؤوليات (RACI Matrix)</h2>
            <p class="page-subtitle">توضيح الأدوار والمسؤوليات لكل مهمة</p>
        </div>

        <div class="alert info">
            <i class="fas fa-info-circle"></i>
            <div>
                <strong>R</strong> = Responsible (منفذ) &nbsp;|&nbsp;
                <strong>A</strong> = Accountable (مسؤول) &nbsp;|&nbsp;
                <strong>C</strong> = Consulted (مستشار) &nbsp;|&nbsp;
                <strong>I</strong> = Informed (مُبلّغ)
            </div>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">المهام الرئيسية</h3></div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th style="min-width:180px">المهمة</th>
                            <th>علاء</th><th>أبو محمد</th><th>جود</th>
                            <th>أنس</th><th>عارف</th><th>علم</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${matrix.map(r => `
                            <tr>
                                <td><strong>${r.task}</strong></td>
                                <td>${badge(r.alaa)}</td>
                                <td>${badge(r.abu)}</td>
                                <td>${badge(r.joud)}</td>
                                <td>${badge(r.anas)}</td>
                                <td>${badge(r.aref)}</td>
                                <td>${badge(r.alm)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ====== WASTE & CASHFLOW ======
function getWasteCashflowContent() {
    return `
        <div class="page-header">
            <h2 class="page-title">إدارة الهدر والسيولة النقدية</h2>
            <p class="page-subtitle">تتبع الهدر وتحسين التدفقات المالية</p>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">تتبع الهدر (آخر 7 أيام)</h3></div>
            <div class="stats-grid">
                <div class="stat-card danger">
                    <div class="stat-header"><span class="stat-title">هدر البن</span><div class="stat-icon danger"><i class="fas fa-mug-hot"></i></div></div>
                    <div class="stat-value">2.5 كجم</div>
                    <div class="stat-change negative"><span>قيمة: 350 ريال</span></div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-header"><span class="stat-title">هدر الحليب</span><div class="stat-icon warning"><i class="fas fa-glass-whiskey"></i></div></div>
                    <div class="stat-value">8 لتر</div>
                    <div class="stat-change negative"><span>قيمة: 80 ريال</span></div>
                </div>
                <div class="stat-card info">
                    <div class="stat-header"><span class="stat-title">هدر المعجنات</span><div class="stat-icon primary"><i class="fas fa-cookie-bite"></i></div></div>
                    <div class="stat-value">12 قطعة</div>
                    <div class="stat-change negative"><span>قيمة: 90 ريال</span></div>
                </div>
                <div class="stat-card danger">
                    <div class="stat-header"><span class="stat-title">إجمالي الهدر</span><div class="stat-icon danger"><i class="fas fa-exclamation-circle"></i></div></div>
                    <div class="stat-value">520 ريال</div>
                    <div class="stat-change"><span>2.1% من المبيعات</span></div>
                </div>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">التدفق النقدي (شهري)</h3></div>
            <div class="table-responsive">
                <table>
                    <thead><tr><th>البند</th><th>المبلغ</th><th>النوع</th><th>الحالة</th></tr></thead>
                    <tbody>
                        <tr><td>مبيعات نقدية</td><td style="color:var(--success);font-weight:600">+45,000 ريال</td><td><span class="badge success">تدفق داخل</span></td><td><span class="badge success">مستلم</span></td></tr>
                        <tr><td>مبيعات آجلة (B2B)</td><td style="color:var(--success);font-weight:600">+23,500 ريال</td><td><span class="badge success">تدفق داخل</span></td><td><span class="badge warning">معلق</span></td></tr>
                        <tr><td>إيجار</td><td style="color:var(--danger);font-weight:600">-12,000 ريال</td><td><span class="badge danger">تدفق خارج</span></td><td><span class="badge success">مدفوع</span></td></tr>
                        <tr><td>رواتب</td><td style="color:var(--danger);font-weight:600">-10,000 ريال</td><td><span class="badge danger">تدفق خارج</span></td><td><span class="badge success">مدفوع</span></td></tr>
                        <tr><td>شراء خامات</td><td style="color:var(--danger);font-weight:600">-18,500 ريال</td><td><span class="badge danger">تدفق خارج</span></td><td><span class="badge success">مدفوع</span></td></tr>
                        <tr><td>كهرباء وماء</td><td style="color:var(--danger);font-weight:600">-3,200 ريال</td><td><span class="badge danger">تدفق خارج</span></td><td><span class="badge warning">قريباً</span></td></tr>
                        <tr style="border-top:2px solid var(--border-color);font-weight:700">
                            <td><strong>صافي التدفق النقدي</strong></td>
                            <td style="color:var(--success);font-size:1.1rem">+24,800 ريال</td>
                            <td colspan="2"><span class="badge success"><i class="fas fa-check"></i> إيجابي</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="alert success">
            <i class="fas fa-check-circle"></i>
            <div><strong>الوضع الصحي:</strong> التدفق النقدي إيجابي، ولكن يجب متابعة المبيعات الآجلة البالغة 23,500 ريال</div>
        </div>
    `;
}

// ====== VISION DASHBOARD ======
function getVisionDashboardContent() {
    return `
        <div class="page-header">
            <h2 class="page-title">الرؤية الانتقالية ولوحة الأداء المالي</h2>
            <p class="page-subtitle">ملخص شامل للأداء التشغيلي والمالي</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header"><span class="stat-title">إجمالي الإيرادات (شهري)</span><div class="stat-icon primary"><i class="fas fa-chart-line"></i></div></div>
                <div class="stat-value">80,000 ريال</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>18% عن الشهر الماضي</span></div>
            </div>
            <div class="stat-card success">
                <div class="stat-header"><span class="stat-title">مبيعات البار</span><div class="stat-icon success"><i class="fas fa-coffee"></i></div></div>
                <div class="stat-value">48,000 ريال</div>
                <div class="stat-change"><span>60% من الإجمالي</span></div>
            </div>
            <div class="stat-card warning">
                <div class="stat-header"><span class="stat-title">مبيعات المحمصة</span><div class="stat-icon warning"><i class="fas fa-fire"></i></div></div>
                <div class="stat-value">32,000 ريال</div>
                <div class="stat-change"><span>40% من الإجمالي</span></div>
            </div>
            <div class="stat-card danger">
                <div class="stat-header"><span class="stat-title">إجمالي المصاريف</span><div class="stat-icon danger"><i class="fas fa-receipt"></i></div></div>
                <div class="stat-value">55,200 ريال</div>
                <div class="stat-change"><span>69% من الإيرادات</span></div>
            </div>
        </div>

        <div class="table-card" style="text-align:center">
            <div class="table-header"><h3 class="table-title">صافي الدخل التشغيلي</h3></div>
            <div class="stat-card success" style="max-width:360px;margin:0 auto">
                <div class="stat-header"><span class="stat-title">الربح الشهري الصافي</span><div class="stat-icon success"><i class="fas fa-money-bill-wave"></i></div></div>
                <div class="stat-value">24,800 ريال</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>31% هامش صافي الربح</span></div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title">الإيرادات الشهرية (6 أشهر)</h3></div>
                <div class="chart-container"><canvas id="monthlyRevenueChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="table-header"><h3 class="table-title">توزيع المصاريف</h3></div>
                <div class="table-responsive">
                    <table>
                        <thead><tr><th>بند المصروف</th><th>المبلغ</th><th>النسبة</th></tr></thead>
                        <tbody>
                            <tr><td>تكلفة البضاعة المباعة</td><td>27,200 ريال</td><td>34%</td></tr>
                            <tr><td>إيجار</td><td>12,000 ريال</td><td>15%</td></tr>
                            <tr><td>رواتب</td><td>10,000 ريال</td><td>12.5%</td></tr>
                            <tr><td>كهرباء وماء</td><td>3,500 ريال</td><td>4.4%</td></tr>
                            <tr><td>مصاريف أخرى</td><td>2,500 ريال</td><td>3.1%</td></tr>
                            <tr style="font-weight:700;border-top:2px solid var(--border-color)">
                                <td>الإجمالي</td><td>55,200 ريال</td><td>69%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="alert info">
            <i class="fas fa-lightbulb"></i>
            <div><strong>التوصية:</strong> هامش الربح جيد (31%)، ويمكن تحسينه بتقليل تكلفة البضاعة المباعة من خلال التفاوض مع الموردين</div>
        </div>
    `;
}

// ====== FINANCIAL COMMITMENTS ======
function getFinancialCommitmentsContent() {
    return `
        <div class="page-header">
            <h2 class="page-title">حصر الالتزامات والمصاريف المالية</h2>
            <p class="page-subtitle">تتبع وجدولة جميع التكاليف الثابتة والمتغيرة</p>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">التكاليف الثابتة الشهرية</h3></div>
            <div class="table-responsive">
                <table>
                    <thead><tr><th>البند</th><th>المبلغ</th><th>تاريخ الاستحقاق</th><th>طريقة الدفع</th><th>الحالة</th><th>الإجراء</th></tr></thead>
                    <tbody>
                        <tr><td>الإيجار</td><td>12,000 ريال</td><td>1 من كل شهر</td><td>تحويل بنكي</td><td><span class="badge success">مدفوع</span></td><td><button class="btn btn-outline" style="padding:0.25rem 0.75rem;font-size:0.82rem" id="viewRentBtn">عرض</button></td></tr>
                        <tr><td>الكهرباء</td><td>3,200 ريال</td><td>20 من كل شهر</td><td>SADAD</td><td><span class="badge warning">قريباً (5 أيام)</span></td><td><button class="btn btn-primary" style="padding:0.25rem 0.75rem;font-size:0.82rem" id="payElectricBtn">دفع</button></td></tr>
                        <tr><td>المقابل المالي (البلدية)</td><td>800 ريال</td><td>15 من كل شهر</td><td>تحويل بنكي</td><td><span class="badge success">مدفوع</span></td><td><button class="btn btn-outline" style="padding:0.25rem 0.75rem;font-size:0.82rem" id="viewMuniBtn">عرض</button></td></tr>
                        <tr><td>التأمينات الاجتماعية</td><td>1,800 ريال</td><td>10 من كل شهر</td><td>خصم تلقائي</td><td><span class="badge success">مدفوع</span></td><td><button class="btn btn-outline" style="padding:0.25rem 0.75rem;font-size:0.82rem" id="viewInsBtn">عرض</button></td></tr>
                        <tr><td>ترخيص الفال (سنوي)</td><td>500 ريال</td><td>مارس</td><td>تحويل بنكي</td><td><span class="badge info">قريباً (2 شهر)</span></td><td><button class="btn btn-outline" style="padding:0.25rem 0.75rem;font-size:0.82rem" id="remindFaalBtn">تذكير</button></td></tr>
                        <tr><td>اشتراك Foodics</td><td>299 ريال</td><td>5 من كل شهر</td><td>بطاقة ائتمان</td><td><span class="badge success">مدفوع</span></td><td><button class="btn btn-outline" style="padding:0.25rem 0.75rem;font-size:0.82rem" id="viewFoodicsBtn">عرض</button></td></tr>
                        <tr><td>اشتراك إنترنت</td><td>200 ريال</td><td>28 من كل شهر</td><td>خصم تلقائي</td><td><span class="badge success">نشط</span></td><td><button class="btn btn-outline" style="padding:0.25rem 0.75rem;font-size:0.82rem" id="viewNetBtn">عرض</button></td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">التكاليف المتغيرة (آخر شهر)</h3></div>
            <div class="stats-grid">
                <div class="stat-card primary"><div class="stat-header"><span class="stat-title">البن الأخضر</span><div class="stat-icon primary"><i class="fas fa-seedling"></i></div></div><div class="stat-value">12,500 ريال</div><div class="stat-change"><span>آخر طلب: 15/03/2024</span></div></div>
                <div class="stat-card success"><div class="stat-header"><span class="stat-title">الحليب والمنكهات</span><div class="stat-icon success"><i class="fas fa-glass-whiskey"></i></div></div><div class="stat-value">6,800 ريال</div><div class="stat-change"><span>طلب أسبوعي</span></div></div>
                <div class="stat-card warning"><div class="stat-header"><span class="stat-title">التغليف والأكياس</span><div class="stat-icon warning"><i class="fas fa-box"></i></div></div><div class="stat-value">2,400 ريال</div><div class="stat-change"><span>آخر طلب: 10/03/2024</span></div></div>
                <div class="stat-card info"><div class="stat-header"><span class="stat-title">مواد تنظيف ومستهلكات</span><div class="stat-icon primary"><i class="fas fa-spray-can"></i></div></div><div class="stat-value">1,200 ريال</div><div class="stat-change"><span>شهري</span></div></div>
            </div>
        </div>

        <div class="alert warning">
            <i class="fas fa-bell"></i>
            <div><strong>تنبيهات الدفع:</strong> لديك 2 دفعة مستحقة خلال الأسبوع القادم (الكهرباء: 3,200 ريال)</div>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">التقويم المالي (هذا الشهر)</h3></div>
            <div class="table-responsive">
                <table>
                    <thead><tr><th>التاريخ</th><th>البند</th><th>المبلغ</th><th>الحالة</th></tr></thead>
                    <tbody>
                        <tr><td>1 مارس</td><td>الإيجار</td><td>12,000 ريال</td><td><span class="badge success"><i class="fas fa-check"></i> مدفوع</span></td></tr>
                        <tr><td>5 مارس</td><td>Foodics</td><td>299 ريال</td><td><span class="badge success"><i class="fas fa-check"></i> مدفوع</span></td></tr>
                        <tr><td>10 مارس</td><td>التأمينات</td><td>1,800 ريال</td><td><span class="badge success"><i class="fas fa-check"></i> مدفوع</span></td></tr>
                        <tr><td>15 مارس</td><td>البلدية</td><td>800 ريال</td><td><span class="badge success"><i class="fas fa-check"></i> مدفوع</span></td></tr>
                        <tr style="background:#FFFBEB"><td>20 مارس</td><td>الكهرباء</td><td>3,200 ريال</td><td><span class="badge warning"><i class="fas fa-clock"></i> قريباً</span></td></tr>
                        <tr><td>28 مارس</td><td>الإنترنت</td><td>200 ريال</td><td><span class="badge info">مجدول</span></td></tr>
                        <tr><td>31 مارس</td><td>الرواتب</td><td>10,000 ريال</td><td><span class="badge info">مجدول</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ====== CAFE SALES (OFFICIAL AREF & ELEM SHIFT SYSTEM) ======
function getCafeSalesContent() {
    const shiftReports = [
        { date: "2026-09-15", shift: "صباحي (عارف)", barista: "عارف", cups: 72, desserts: 14, revenue: 1320, tickets: 53, avgTicket: 24.9, notes: "إقبال ممتاز على قهوة اليوم والكرواسون" },
        { date: "2026-09-14", shift: "مسائي (علم)", barista: "علم", cups: 92, desserts: 22, revenue: 1720, tickets: 64, avgTicket: 26.8, notes: "ذروة مسائية عالية ومبيعات كولد برو ممتازة" },
        { date: "2026-09-14", shift: "صباحي (عارف)", barista: "عارف", cups: 65, desserts: 11, revenue: 1185, tickets: 48, avgTicket: 24.6, notes: "حركة منتظمة ومعايرة ممتازة للفلتر" },
        { date: "2026-09-13", shift: "مسائي (علم)", barista: "علم", cups: 88, desserts: 19, revenue: 1590, tickets: 60, avgTicket: 26.5, notes: "طلب عالي على الحلى والمشروبات الباردة" },
        { date: "2026-09-13", shift: "صباحي (عارف)", barista: "عارف", cups: 58, desserts: 9, revenue: 1040, tickets: 42, avgTicket: 24.7, notes: "فترة الصباح هادئة ومبيعات بن منزلي" }
    ];

    const totalMorningRev = 1320 + 1185 + 1040;
    const totalEveningRev = 1720 + 1590;
    const totalCups = 72 + 92 + 65 + 88 + 58;

    return `
        <div class="page-header">
            <h2 class="page-title">تقارير مبيعات البار والورديات (وردية عارف وعلم)</h2>
            <p class="page-subtitle">تتبع تفصيلي لأداء شفتات البار: الوردية الصباحية (عارف 8:00 - 16:00) والوردية المسائية (علم 16:00 - 00:00)</p>
        </div>

        <!-- Stat Summary Grid -->
        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header">
                    <span class="stat-title">إجمالي مبيعات الورديات</span>
                    <div class="stat-icon primary"><i class="fas fa-cash-register"></i></div>
                </div>
                <div class="stat-value">${(totalMorningRev + totalEveningRev).toLocaleString('en-US')} ر.س</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>مجموع آخر 5 ورديات</span></div>
            </div>

            <div class="stat-card success">
                <div class="stat-header">
                    <span class="stat-title">الوردية الصباحية (عارف)</span>
                    <div class="stat-icon success"><i class="fas fa-sun"></i></div>
                </div>
                <div class="stat-value">${totalMorningRev.toLocaleString('en-US')} ر.س</div>
                <div class="stat-change"><span>195 كوب | متوسط تذكرة 24.7 ر.س</span></div>
            </div>

            <div class="stat-card warning">
                <div class="stat-header">
                    <span class="stat-title">الوردية المسائية (علم)</span>
                    <div class="stat-icon warning"><i class="fas fa-moon"></i></div>
                </div>
                <div class="stat-value">${totalEveningRev.toLocaleString('en-US')} ر.س</div>
                <div class="stat-change"><span>180 كوب | متوسط تذكرة 26.6 ر.س</span></div>
            </div>

            <div class="stat-card info">
                <div class="stat-header">
                    <span class="stat-title">إجمالي الأكواب المباعة</span>
                    <div class="stat-icon primary"><i class="fas fa-mug-hot"></i></div>
                </div>
                <div class="stat-value">${totalCups} كوب</div>
                <div class="stat-change positive"><span>معدل تدفق 18 كوب / ساعة ذروة</span></div>
            </div>
        </div>

        <!-- Shift Charts Grid -->
        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title"><i class="fas fa-chart-column" style="color:#0284C7;margin-left:6px;"></i> مقارنة مبيعات الشفتات (عارف vs علم)</h3>
                </div>
                <div class="chart-container"><canvas id="shiftComparisonChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title"><i class="fas fa-chart-pie" style="color:#10B981;margin-left:6px;"></i> المشروبات الأكثر طلباً في البار</h3>
                </div>
                <div class="chart-container"><canvas id="topProductsChart"></canvas></div>
            </div>
        </div>

        <!-- Shift Breakdown Table -->
        <div class="table-card">
            <div class="table-header">
                <div>
                    <h3 class="table-title">سجل ورديات مبيعات البار اليومية التفصيلي</h3>
                    <p style="margin:4px 0 0 0;font-size:0.8rem;color:#64748B;">بيانات مسجلة ومطابقة مع نظام نقاط البيع POS</p>
                </div>
                <div style="display:flex;gap:8px;">
                    <button class="btn btn-outline" onclick="window.print()"><i class="fas fa-print"></i> طباعة</button>
                    <button class="btn btn-primary" onclick="alert('تم تصدير سجل الورديات بنجاح إلى ملف CSV.')"><i class="fas fa-file-csv"></i> تصدير CSV</button>
                </div>
            </div>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>التاريخ</th>
                            <th>الوردية / الشفت</th>
                            <th>الباريستا المسؤول</th>
                            <th>عدد الأكواب</th>
                            <th>قطع الحلويات</th>
                            <th>إجمالي المبيعات</th>
                            <th>عدد الفواتير</th>
                            <th>متوسط الفاتورة</th>
                            <th>ملاحظات الوردية الميدانية</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${shiftReports.map(s => {
                            const isMorning = s.barista === 'عارف';
                            return `
                                <tr>
                                    <td style="font-weight:700;color:#0F172A;">${s.date}</td>
                                    <td><span class="badge ${isMorning ? 'badge-blue' : 'badge-oxford'}">${s.shift}</span></td>
                                    <td><strong style="color:#0284C7;"><i class="fas fa-user-circle" style="margin-left:4px;"></i>${s.barista}</strong></td>
                                    <td style="font-weight:700;">${s.cups} كوب</td>
                                    <td>${s.desserts} قطعة</td>
                                    <td style="font-weight:800;color:#10B981;">${s.revenue.toLocaleString('en-US')} ر.س</td>
                                    <td>${s.tickets}</td>
                                    <td style="font-weight:700;color:#0F172A;">${s.avgTicket.toFixed(1)} ر.س</td>
                                    <td style="font-size:0.8rem;color:#64748B;">${s.notes}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ====== ROASTERY SALES (PRIMARY ROASTER "الحماصة الرائدة" B2B & RETAIL) ======
function getRoasterySalesContent() {
    const roastSales = [
        { date: "2026-09-15", client: "مقهى الأفق (حائل)", kg: 50, pricePerKg: 75, type: "wholesale", paid: 3750, pending: 0, status: "مكتمل" },
        { date: "2026-09-14", client: "مبيعات رف الفرع (أرباع 250جم)", kg: 25, pricePerKg: 110, type: "retail", paid: 2750, pending: 0, status: "مكتمل" },
        { date: "2026-09-12", client: "سلسلة مقاهي نجد المختصة", kg: 80, pricePerKg: 82, type: "wholesale", paid: 6560, pending: 0, status: "مكتمل" },
        { date: "2026-09-10", client: "متجر RoR الإلكتروني (أرباع 250جم)", kg: 18, pricePerKg: 95, type: "retail", paid: 1710, pending: 0, status: "مكتمل" }
    ];

    const totalKg = roastSales.reduce((sum, r) => sum + r.kg, 0);
    const totalRevenue = roastSales.reduce((sum, r) => sum + r.paid, 0);
    const wholesaleKg = roastSales.filter(r => r.type === 'wholesale').reduce((sum, r) => sum + r.kg, 0);
    const retailKg = roastSales.filter(r => r.type === 'retail').reduce((sum, r) => sum + r.kg, 0);

    return `
        <div class="page-header">
            <h2 class="page-title">تقارير إنتاج ومبيعات المحمصة (الحماصة الرائدة)</h2>
            <p class="page-subtitle">إدارة مبيعات الجملة B2B وتوزيع أرباع البن (250جم) لرف الفرع والمتجر الإلكتروني عبر "الحماصة الرائدة"</p>
        </div>

        <!-- KPI Stat Grid -->
        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header">
                    <span class="stat-title">إجمالي إيراد التحميص</span>
                    <div class="stat-icon primary"><i class="fas fa-fire-burner"></i></div>
                </div>
                <div class="stat-value">${totalRevenue.toLocaleString('en-US')} ر.س</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>الحماصة الرائدة</span></div>
            </div>

            <div class="stat-card success">
                <div class="stat-header">
                    <span class="stat-title">إجمالي البن المحمص</span>
                    <div class="stat-icon success"><i class="fas fa-weight-hanging"></i></div>
                </div>
                <div class="stat-value">${totalKg} كجم</div>
                <div class="stat-change positive"><span>معدل فقد وزن مثالي (<14.5%)</span></div>
            </div>

            <div class="stat-card warning">
                <div class="stat-header">
                    <span class="stat-title">عقود الجملة B2B</span>
                    <div class="stat-icon warning"><i class="fas fa-handshake"></i></div>
                </div>
                <div class="stat-value">${wholesaleKg} كجم</div>
                <div class="stat-change"><span>مقهى الأفق + سلسلة مقاهي نجد</span></div>
            </div>

            <div class="stat-card info">
                <div class="stat-header">
                    <span class="stat-title">مبيعات أرباع (250جم)</span>
                    <div class="stat-icon primary"><i class="fas fa-bag-shopping"></i></div>
                </div>
                <div class="stat-value">${retailKg * 4} كيس</div>
                <div class="stat-change"><span>${retailKg} كجم للرف والمتجر</span></div>
            </div>
        </div>

        <!-- Roastery Charts -->
        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title"><i class="fas fa-chart-pie" style="color:#0284C7;margin-left:6px;"></i> توزيع قنوات تصريف التحميص</h3>
                </div>
                <div class="chart-container"><canvas id="salesChannelsChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title"><i class="fas fa-chart-line" style="color:#10B981;margin-left:6px;"></i> مسار نمو إنتاج الحماصة الرائدة</h3>
                </div>
                <div class="chart-container"><canvas id="roasteryTrendChart"></canvas></div>
            </div>
        </div>

        <!-- Roastery Sales Records -->
        <div class="table-card">
            <div class="table-header">
                <div>
                    <h3 class="table-title">سجل صفقات وتوريد حبوب القهوة المحمصة</h3>
                    <p style="margin:4px 0 0 0;font-size:0.8rem;color:#64748B;">بيانات التوريد المعتمدة لعملاء الجملة والقطاعي</p>
                </div>
                <div style="display:flex;gap:8px;">
                    <button class="btn btn-outline" onclick="window.print()"><i class="fas fa-print"></i> طباعة</button>
                    <button class="btn btn-primary" onclick="alert('تم تصدير سجل مبيعات المحمصة بنجاح.')"><i class="fas fa-file-csv"></i> تصدير CSV</button>
                </div>
            </div>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>التاريخ</th>
                            <th>العميل / القناة</th>
                            <th>نوع الطلبية</th>
                            <th>الكمية (كجم)</th>
                            <th>أكياس (250جم)</th>
                            <th>سعر الكيلو</th>
                            <th>إجمالي المدفوع</th>
                            <th>حالة الطلب</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${roastSales.map(r => {
                            const isWholesale = r.type === 'wholesale';
                            const bags250 = isWholesale ? '-' : `${r.kg * 4} كيس`;
                            return `
                                <tr>
                                    <td style="font-weight:700;color:#0F172A;">${r.date}</td>
                                    <td style="font-weight:800;color:#0F172A;">${r.client}</td>
                                    <td><span class="badge ${isWholesale ? 'badge-oxford' : 'badge-blue'}">${isWholesale ? 'جملة (الحماصة الرائدة)' : 'أرباع تجزئة 250جم'}</span></td>
                                    <td style="font-weight:800;color:#0284C7;">${r.kg} كجم</td>
                                    <td>${bags250}</td>
                                    <td style="color:#64748B;">${r.pricePerKg} ر.س</td>
                                    <td style="font-weight:800;color:#10B981;">${r.paid.toLocaleString('en-US')} ر.س</td>
                                    <td><span class="badge badge-green"><i class="fas fa-check-circle" style="margin-left:4px;"></i>${r.status}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ====== REVOLUTION PLAN ======
function getRevolutionPlanContent() {
    const phases = [
        {
            date: 'الأسبوع 1-2 | مارس 2024',
            title: 'مرحلة التأسيس والاستقرار',
            items: [
                'إطلاق نظام RoR التشغيلي الموحد',
                'تفعيل مصفوفة المسؤوليات (RACI)',
                'بدء تسجيل البيانات اليومية بانتظام',
                'تدريب الفريق على النظام الجديد'
            ]
        },
        {
            date: 'الأسبوع 3-4 | مارس 2024',
            title: 'مرحلة تحسين الإيرادات',
            items: [
                'تطبيق هندسة القائمة وإزالة "الكلاب"',
                'رفع أسعار المنتجات بنسبة 10%',
                'إطلاق حملة المؤثرين (Barter)',
                'استهداف 3 عملاء B2B جدد'
            ]
        },
        {
            date: 'أبريل 2024',
            title: 'مرحلة التوسع والنمو',
            items: [
                'إطلاق المتجر الإلكتروني',
                'التفاوض مع 2 نقطة بيع جديدة',
                'إطلاق خط إنتاج محمصة جديد',
                'توظيف مندوب مبيعات B2B متخصص'
            ]
        },
        {
            date: 'مايو - يونيو 2024',
            title: 'مرحلة التعزيز والاستدامة',
            items: [
                'مراجعة KPIs وتعديل الأهداف',
                'التخطيط لفرع ثانٍ أو محطة تحميص',
                'تطوير برنامج ولاء العملاء',
                'دراسة إمكانية التصدير للخارج'
            ]
        }
    ];

    return `
        <div class="page-header">
            <h2 class="page-title">خطة ثورة RoR التنفيذية <i class="fas fa-rocket" style="color:var(--primary-color)"></i></h2>
            <p class="page-subtitle">خارطة طريق التحول من الوضع الراهن إلى الريادة</p>
        </div>

        <div class="stats-grid" style="margin-bottom:2rem">
            <div class="stat-card success"><div class="stat-header"><span class="stat-title">الهدف: إيرادات شهرية</span><div class="stat-icon success"><i class="fas fa-bullseye"></i></div></div><div class="stat-value">120,000 ريال</div><div class="stat-change"><span>بحلول ديسمبر 2024</span></div></div>
            <div class="stat-card primary"><div class="stat-header"><span class="stat-title">الهدف: عملاء B2B</span><div class="stat-icon primary"><i class="fas fa-handshake"></i></div></div><div class="stat-value">25 عميل</div><div class="stat-change"><span>بحلول يونيو 2024</span></div></div>
            <div class="stat-card warning"><div class="stat-header"><span class="stat-title">الهدف: نقاط البيع</span><div class="stat-icon warning"><i class="fas fa-store"></i></div></div><div class="stat-value">10 نقطة</div><div class="stat-change"><span>بحلول سبتمبر 2024</span></div></div>
            <div class="stat-card info"><div class="stat-header"><span class="stat-title">الهدف: متابعو السوشيال</span><div class="stat-icon primary"><i class="fas fa-users"></i></div></div><div class="stat-value">10,000</div><div class="stat-change"><span>بحلول ديسمبر 2024</span></div></div>
        </div>

        <div class="timeline">
            ${phases.map(p => `
                <div class="timeline-item">
                    <div class="timeline-date">${p.date}</div>
                    <div class="timeline-title">${p.title}</div>
                    <div class="timeline-body">
                        <ul>${p.items.map(i => `<li>${i}</li>`).join('')}</ul>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="alert success" style="margin-top:2rem">
            <i class="fas fa-rocket"></i>
            <div><strong>الرؤية:</strong> تحويل RoR إلى أبرز علامة تجارية للقهوة المتخصصة في المنطقة بحلول 2025</div>
        </div>
    `;
}

// ====== ORGANIZATIONAL BLUEPRINT (24-JOB STRUCTURE) ======
function getOrgChartContent() {
    return `
        <div class="org-view-wrapper">
            <!-- Header Group -->
            <div class="page-header" style="margin-bottom:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
                    <div>
                        <h2 class="page-title"><i class="fas fa-sitemap" style="color:#0284C7;margin-left:8px;"></i> الهيكل والتنظيم المؤسسي لـ RoR (المخطط الكامل: 24 وظيفة)</h2>
                        <p class="page-subtitle">تسكين الوظائف المعتمدة، توزيع الشركاء المؤسسين، شواغر التوسع الميداني، ومتابعة نسبة التسكين</p>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button class="btn btn-outline" onclick="window.print()"><i class="fas fa-print"></i> طباعة الهيكل</button>
                    </div>
                </div>
            </div>

            <!-- Top Stat Summary Grid (4 Cards) -->
            <div class="org-kpi-grid">
                <!-- 1. Total Approved Jobs -->
                <div class="org-kpi-box kpi-total">
                    <div class="kpi-top-row">
                        <span class="kpi-box-label">إجمالي الوظائف المعتمدة</span>
                        <div class="kpi-box-icon icon-accent"><i class="fas fa-briefcase"></i></div>
                    </div>
                    <div class="kpi-box-number" id="kpiTotalJobs">24</div>
                    <div class="kpi-box-sub">وظيفة معتمدة في الهيكل</div>
                </div>

                <!-- 2. Occupied Jobs -->
                <div class="org-kpi-box kpi-occupied">
                    <div class="kpi-top-row">
                        <span class="kpi-box-label">الوظائف القائمة (المشغولة)</span>
                        <div class="kpi-box-icon icon-success"><i class="fas fa-user-check"></i></div>
                    </div>
                    <div class="kpi-box-number" id="kpiOccupiedJobs" style="color:#10B981;">6</div>
                    <div class="kpi-box-sub">4 شركاء مؤسسين + 2 باريستا بار</div>
                </div>

                <!-- 3. Vacancies -->
                <div class="org-kpi-box kpi-vacant">
                    <div class="kpi-top-row">
                        <span class="kpi-box-label">الشواغر المستهدفة للتوظيف</span>
                        <div class="kpi-box-icon icon-gold"><i class="far fa-clock"></i></div>
                    </div>
                    <div class="kpi-box-number" id="kpiVacantJobs" style="color:#F59E0B;">18</div>
                    <div class="kpi-box-sub">شاغراً مستهدفاً للتوسع والتشغيل</div>
                </div>

                <!-- 4. Staffing Ratio -->
                <div class="org-kpi-box kpi-ratio">
                    <div class="kpi-top-row">
                        <span class="kpi-box-label">نسبة التسكين الميداني</span>
                        <div class="kpi-box-icon icon-pie"><i class="fas fa-chart-pie"></i></div>
                    </div>
                    <div class="kpi-box-number" id="kpiRatioText" style="color:#EA580C;">25%</div>
                    <div class="kpi-box-sub">معدل الإشغال من إجمالي الهيكل</div>
                    <div class="kpi-progress-bar-bg">
                        <div class="kpi-progress-bar-fill" id="kpiRatioFill" style="width: 25%;"></div>
                    </div>
                </div>
            </div>

            <!-- Category Filter Pills & Live Search Bar -->
            <div class="org-filter-bar">
                <div class="filter-pills-group" id="blueprintFilterPills">
                    <button type="button" class="filter-pill-btn active" onclick="filterBlueprint('all', this)">
                        <span>الكل</span>
                        <span class="pill-counter" id="pillCountAll">24</span>
                    </button>
                    <button type="button" class="filter-pill-btn" onclick="filterBlueprint('occupied', this)">
                        <span>المشغولة حالياً</span>
                        <span class="pill-counter" id="pillCountOccupied">6</span>
                    </button>
                    <button type="button" class="filter-pill-btn" onclick="filterBlueprint('vacant', this)">
                        <span>الشواغر المستهدفة</span>
                        <span class="pill-counter" id="pillCountVacant">18</span>
                    </button>
                    <button type="button" class="filter-pill-btn" onclick="filterBlueprint('exec', this)">
                        <span>الإدارة العليا</span>
                        <span class="pill-counter">4</span>
                    </button>
                    <button type="button" class="filter-pill-btn" onclick="filterBlueprint('bar', this)">
                        <span>المقهى والبار</span>
                        <span class="pill-counter">4</span>
                    </button>
                    <button type="button" class="filter-pill-btn" onclick="filterBlueprint('ops', this)">
                        <span>الأقسام التشغيلية</span>
                        <span class="pill-counter">16</span>
                    </button>
                </div>
                <div class="org-search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="blueprintSearchInput" placeholder="بحث باسم الوظيفة، المرشح، أو المسمى الإنجليزي..." oninput="searchBlueprint(this.value)">
                </div>
            </div>

            <!-- SECTION 1: EXECUTIVE GOVERNANCE TIER (4 EQUAL FOUNDING PARTNERS ON EXACT SAME ROW - 4-COLUMN GRID) -->
            <div class="blueprint-section" id="section-exec">
                <div class="section-headline">
                    <div class="section-headline-title">
                        <i class="fas fa-crown" style="color:#0284C7;"></i>
                        <span>المستوى الأول: الإدارة العليا والشركاء المؤسسون (4 شركاء متساوون)</span>
                    </div>
                    <span class="section-headline-badge">4 وظائف مشغولة (100%)</span>
                </div>
                <div class="job-cards-grid grid-4-cols">
                    
        <div class="org-job-card is-occupied" data-job-id="exec-alaa" data-category="exec" data-status="occupied">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-crown"></i> قيادة استراتيجية وحوكمة</span>
                    <span class="status-badge occupied"><span class="pulse-dot"></span> قائم / مشغول</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-partner-1">ع</div>
                    <div class="person-name-title">
                        <h3>علاء يوسف</h3>
                        <div class="job-role-en">Chief Strategic Advisor (CSA) to CEO & Roastmaster</div>
                    </div>
                </div>
                <div class="job-summary-desc">مرجع الجودة والاستراتيجية وتصميم بروفايلات الحماصة الرائدة وضبط المعايير التأسيسية للمحاصيل الفاخرة.</div>
                <ul class="job-responsibilities-list">
                    <li>تصميم وبرمجة منحنيات التحميص (Roast Profiles) لالحماصة الرائدة.</li><li>قيادة جلسات تقييم جودة القهوة المختصة والتذوق الحسي (SCA Cupping).</li><li>التوجيه الاستراتيجي والرقابة على مصفوفة الحوكمة وضبط هوامش الربحية.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <div class="btn-assigned-done" style="background:rgba(2,132,199,0.08);border-color:rgba(2,132,199,0.25);color:#0284C7;">
                    <span><i class="fas fa-shield-halved" style="margin-left:5px;"></i> شريك مؤسس معتمد</span>
                    <span style="font-size:0.75rem;font-weight:800;color:#0F172A;">عضو إدارة</span>
                </div>
            </div>
        </div>
    
        <div class="org-job-card is-occupied" data-job-id="exec-joud" data-category="exec" data-status="occupied">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-crown"></i> قيادة استراتيجية وحوكمة</span>
                    <span class="status-badge occupied"><span class="pulse-dot"></span> قائم / مشغول</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-partner-2">ج</div>
                    <div class="person-name-title">
                        <h3>جود القصير</h3>
                        <div class="job-role-en">Chief Executive Officer & Chief Marketing Officer (CEO & CMO)</div>
                    </div>
                </div>
                <div class="job-summary-desc">القيادة العامة وإدارة القنوات الرقمية ومبيعات الرف والمتجر وتوسيع قاعدة عملاء التجزئة والجملة.</div>
                <ul class="job-responsibilities-list">
                    <li>إدارة العمل المؤسسي الشامل وتنسيق الخطط التطويرية بين الشركاء.</li><li>إدارة الحملات التسويقية الرقمية، قنوات التواصل الاجتماعي، والهوية البصرية.</li><li>تنشيط مبيعات الرف بالفرع والمتجر الإلكتروني وشراكات الضيافة.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <div class="btn-assigned-done" style="background:rgba(2,132,199,0.08);border-color:rgba(2,132,199,0.25);color:#0284C7;">
                    <span><i class="fas fa-shield-halved" style="margin-left:5px;"></i> شريك مؤسس معتمد</span>
                    <span style="font-size:0.75rem;font-weight:800;color:#0F172A;">عضو إدارة</span>
                </div>
            </div>
        </div>
    
        <div class="org-job-card is-occupied" data-job-id="exec-abdullah" data-category="exec" data-status="occupied">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-crown"></i> قيادة استراتيجية وحوكمة</span>
                    <span class="status-badge occupied"><span class="pulse-dot"></span> قائم / مشغول</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-partner-3">ع</div>
                    <div class="person-name-title">
                        <h3>عبد الله القصير</h3>
                        <div class="job-role-en">Chief Operating Officer (COO)</div>
                    </div>
                </div>
                <div class="job-summary-desc">مدير العمليات والتشغيل الميداني وسلاسل الإمداد والتنسيق الدائم بين حركة البار وخط إنتاج المحمصة.</div>
                <ul class="job-responsibilities-list">
                    <li>الإشراف اليومي الميداني على انضباط ورديات البار ونظافة المعرض والمعدات.</li><li>إدارة سلاسل الإمداد والمخزون الحرج (Min/Max Par Levels) ومكافحة الهدر.</li><li>التنسيق اللوجستي بين إنتاج الحماصة الرائدة واحتياجات الفرع.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <div class="btn-assigned-done" style="background:rgba(2,132,199,0.08);border-color:rgba(2,132,199,0.25);color:#0284C7;">
                    <span><i class="fas fa-shield-halved" style="margin-left:5px;"></i> شريك مؤسس معتمد</span>
                    <span style="font-size:0.75rem;font-weight:800;color:#0F172A;">عضو إدارة</span>
                </div>
            </div>
        </div>
    
        <div class="org-job-card is-occupied" data-job-id="exec-anas" data-category="exec" data-status="occupied">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-crown"></i> قيادة استراتيجية وحوكمة</span>
                    <span class="status-badge occupied"><span class="pulse-dot"></span> قائم / مشغول</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-partner-4">أ</div>
                    <div class="person-name-title">
                        <h3>أنس الصفدي</h3>
                        <div class="job-role-en">Chief Financial Officer (CFO)</div>
                    </div>
                </div>
                <div class="job-summary-desc">المدير المالي والإداري والحسابات ومراقبة التدفق النقدي ومتابعة نقطة التعادل والامتثال النظامي.</div>
                <ul class="job-responsibilities-list">
                    <li>مراقبة السيولة النقدية اليومية وتحديث نموذج نقطة التعادل (Break-even).</li><li>إدارة سجلات المحاسبة، مسيرات الرواتب، والامتثال لمتطلبات الفوترة ZATCA.</li><li>جدولة التزامات الموردين والمصاريف التشغيلية الثابتة والمتغيرة.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <div class="btn-assigned-done" style="background:rgba(2,132,199,0.08);border-color:rgba(2,132,199,0.25);color:#0284C7;">
                    <span><i class="fas fa-shield-halved" style="margin-left:5px;"></i> شريك مؤسس معتمد</span>
                    <span style="font-size:0.75rem;font-weight:800;color:#0F172A;">عضو إدارة</span>
                </div>
            </div>
        </div>
    
                </div>
            </div>

            <!-- SECTION 2: CAFÉ FIELD OPERATIONS (4 CARDS: 2 OCCUPIED + 2 VACANT) -->
            <div class="blueprint-section" id="section-bar">
                <div class="section-headline">
                    <div class="section-headline-title">
                        <i class="fas fa-mug-saucer" style="color:#10B981;"></i>
                        <span>المستوى الثاني: العمليات الميدانية للمقهى والبار (4 وظائف)</span>
                    </div>
                    <span class="section-headline-badge">2 مشغولة | 2 شاغرة</span>
                </div>
                <div class="job-cards-grid grid-4-cols">
                    
        <div class="org-job-card is-occupied" data-job-id="bar-aref" data-category="bar" data-status="occupied">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-mug-saucer"></i> عمليات المقهى والبار</span>
                    <span class="status-badge occupied"><span class="pulse-dot"></span> قائم / مشغول</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-bar-aref">عا</div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">عارف</h3>
                        <div class="job-role-en">باريستا معتمد - الوردية الصباحية</div>
                    </div>
                </div>
                <div class="job-summary-desc">المسؤول عن افتتاح البار الصباحي، معايرة مطاحن الإسبريسو والفلتر، واستقبال ضيوف الصباح بلباقة.</div>
                <ul class="job-responsibilities-list">
                    <li>معايرة استخلاص الإسبريسو والـ V60 مع بداية كل صباح وضبط الجرامات والوقت.</li><li>تحضير مشروبات الحليب المتبخرة والمشروبات الباردة حسب معايير RoR.</li><li>تنفيذ مهام البار بدقة وانضباط تام دون أي مهام إشرافية أو تحميص.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                
            <div class="btn-assigned-done">
                <span><i class="fas fa-user-check" style="margin-left:5px;"></i> كادر معتمد (عارف)</span>
                <span style="font-size:0.75rem;font-weight:700;color:#10B981;">نشط ميدانياً</span>
            </div>
        
            </div>
        </div>
    
        <div class="org-job-card is-occupied" data-job-id="bar-elem" data-category="bar" data-status="occupied">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-mug-saucer"></i> عمليات المقهى والبار</span>
                    <span class="status-badge occupied"><span class="pulse-dot"></span> قائم / مشغول</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-bar-elem">عل</div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">علم</h3>
                        <div class="job-role-en">باريستا معتمد - الوردية المسائية</div>
                    </div>
                </div>
                <div class="job-summary-desc">إدارة أوقات الذروة المسائية، تحضير المشروبات الساخنة والباردة بسرعة فائقة، وإقفال البار اليومي.</div>
                <ul class="job-responsibilities-list">
                    <li>إدارة ضغط الطلبات المسائي وتحضير طلبات الكولد برو والمشروبات الخاصة.</li><li>ترشيح أصناف الحلى ومبيعات البن المنزلي لرفع متوسط الفاتورة اليومية.</li><li>إقفال المحطة وتنظيف وتعقيم المكائن والمطاحن وفق معايير HACCP.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                
            <div class="btn-assigned-done">
                <span><i class="fas fa-user-check" style="margin-left:5px;"></i> كادر معتمد (علم)</span>
                <span style="font-size:0.75rem;font-weight:700;color:#10B981;">نشط ميدانياً</span>
            </div>
        
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="bar-cashier" data-category="bar" data-status="vacant">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-mug-saucer"></i> عمليات المقهى والبار</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-mug-saucer"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">شاغر: كاشير وممثل خدمة عملاء</h3>
                        <div class="job-role-en">Cashier & Guest Experience Specialist</div>
                    </div>
                </div>
                <div class="job-summary-desc">استقبال الضيوف وإدارة نقاط البيع POS وتطبيق أساليب البيع الإضافي (Upselling) لتنشيط مبيعات الحلى.</div>
                <ul class="job-responsibilities-list">
                    <li>استقبال طلبات العملاء بلباقة ومعالجة الدفع السريع (مدى / Apple Pay).</li><li>تطبيق بروتوكول اقتراح أصناف الحلى والبن المنزلي مع كل طلب قهوة.</li><li>مساعدة الباريستا في تنظيم الطوابير وتسليم المشروبات في أوقات الذروة.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                
            <button class="btn-assign-action" onclick="triggerPositionAssign('bar-cashier', 'شاغر: كاشير وممثل خدمة عملاء')">
                <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
            </button>
        
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="bar-backup" data-category="bar" data-status="vacant">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-mug-saucer"></i> عمليات المقهى والبار</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-mug-saucer"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">شاغر: باريستا إضافي / دعم تشغيلي</h3>
                        <div class="job-role-en">Support & Relief Shift Barista</div>
                    </div>
                </div>
                <div class="job-summary-desc">تغطية أيام الإجازات الأسبوعية لعارف وعلم ومساندة ساعات الذروة في عطلات نهاية الأسبوع والمواسم.</div>
                <ul class="job-responsibilities-list">
                    <li>تغطية ورديات الإجازة الأسبوعية وتأمين استمرار عمل البار 7 أيام دون انقطاع.</li><li>المساندة في تجهيز المشروبات الباردة والتحضير المسبق (Prep Sheet).</li><li>تطبيق معايرة استخلاص RoR بدقة ومطابقة جودة الأكواب.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                
            <button class="btn-assign-action" onclick="triggerPositionAssign('bar-backup', 'شاغر: باريستا إضافي / دعم تشغيلي')">
                <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
            </button>
        
            </div>
        </div>
    
                </div>
            </div>

            <!-- SECTION 3: TARGETED EXPANSION POSITIONS (16 DASHED-BORDER CARDS) -->
            <div class="blueprint-section" id="section-ops">
                <div class="section-headline">
                    <div class="section-headline-title">
                        <i class="fas fa-rocket" style="color:#F59E0B;"></i>
                        <span>المستوى الثالث: شواغر التوسع التشغيلي والمحمصة (16 وظيفة شاغرة)</span>
                    </div>
                    <span class="section-headline-badge">16 وظيفة مستهدفة</span>
                </div>
                <div class="job-cards-grid grid-4-cols">
                    
        <div class="org-job-card is-vacant" data-job-id="ops-roaster" data-category="ops" data-status="vacant" data-original-title="حمّاص إنتاج متفرغ (الحماصة الرائدة)">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-fire-burner"></i> قسم المحمصة والإنتاج</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-fire"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">حمّاص إنتاج متفرغ (الحماصة الرائدة)</h3>
                        <div class="job-role-en">Production Roastmaster</div>
                    </div>
                </div>
                <div class="job-summary-desc">تشغيل الحماصة الرائدة، تنفيذ بروفايلات التحميص اليومية، وإدارة دفعات الإنتاج.</div>
                <ul class="job-responsibilities-list">
                    <li>تنفيذ جدول التحميص لدفعات المقهى وطلبيات مبيعات الجملة B2B.</li><li>مراقبة ثبات منحنيات الحرارة ومعامل RoR ومعدل الفقد (Weight Loss).</li><li>صيانة حوض التبريد وجامع القشور وتوثيق بيانات كل دفعة بسجل الإنتاج.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-roaster', 'حمّاص إنتاج متفرغ (الحماصة الرائدة)')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-asst-roaster" data-category="ops" data-status="vacant" data-original-title="مساعد حمّاص ومناول بن">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-fire-burner"></i> قسم المحمصة والإنتاج</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-hand-holding-dollar"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">مساعد حمّاص ومناول بن</h3>
                        <div class="job-role-en">Assistant Roaster & Handler</div>
                    </div>
                </div>
                <div class="job-summary-desc">وزن أكياس البن الأخضر، تلقيم الحماصة، وتفريغ صواني التبريد وترتيب صوامع التخزين.</div>
                <ul class="job-responsibilities-list">
                    <li>تجهيز أوزان الدفعات الخضراء وتنقية الشوائب قبل التحميل.</li><li>متابعة تبريد الحبوب المحمصة ونقلها لحاويات إزالة الغازات (Degassing).</li><li>تنظيف مسارات الهواء ونظام الشفط بنهاية يوم العمل.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-asst-roaster', 'مساعد حمّاص ومناول بن')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-packaging" data-category="ops" data-status="vacant" data-original-title="مسؤول تعبئة وتغليف">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-box-archive"></i> قسم التعبئة واللوجستيات</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-box"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">مسؤول تعبئة وتغليف</h3>
                        <div class="job-role-en">Packaging & Labeling Specialist</div>
                    </div>
                </div>
                <div class="job-summary-desc">تعبئة أكياس الـ 250 جم و 1 كجم، لحام صمام الحفظ الحراري، وتجهيز شحنات الجملة.</div>
                <ul class="job-responsibilities-list">
                    <li>وزن وتعبئة المحاصيل بدقة ±1 جم وضبط اللحام الحراري للأكياس.</li><li>طباعة وتثبيت ملصقات تفاصيل المحصول والإيحاءات وتاريخ التحميص.</li><li>تجهيز كراتين الجملة والطلبيات المخصصة لمنافذ التوزيع والشحن.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-packaging', 'مسؤول تعبئة وتغليف')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-qgrader" data-category="ops" data-status="vacant" data-original-title="أخصائي تقييم جودة (Licensed Q-Grader)">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-award"></i> قسم ضبط الجودة</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-certificate"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">أخصائي تقييم جودة (Licensed Q-Grader)</h3>
                        <div class="job-role-en">Certified Q-Grader & Quality Lead</div>
                    </div>
                </div>
                <div class="job-summary-desc">إدارة جلسات التذوق الدوري لعينات الإنتاج واعتماد درجات التقييم للمحاصيل الخضراء.</div>
                <ul class="job-responsibilities-list">
                    <li>جلسات تذوق أسبوعية معتمدة وفق بروتوكول SCA لتقييم الحبوب المحمصة.</li><li>كشف العيوب النكهية، حموضة القهوة، ومطابقة المواصفات مع الموردين.</li><li>قياس رطوبة وكثافة أكياس البن الأخضر الوارد للمستودع.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-qgrader', 'أخصائي تقييم جودة (Licensed Q-Grader)')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-rd-developer" data-category="ops" data-status="vacant" data-original-title="مطور منتجات ووصفات (R&D)">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-flask-vial"></i> قسم البحث والتطوير (R&D)</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-vial"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">مطور منتجات ووصفات (R&D)</h3>
                        <div class="job-role-en">Beverage & Product Developer</div>
                    </div>
                </div>
                <div class="job-summary-desc">ابتكار خلطات الإسبريسو الحصرية ومشروبات المواسم وتطوير خلطات الكولد برو.</div>
                <ul class="job-responsibilities-list">
                    <li>تطوير وصفات المشروبات المبتكرة الموسمية وحساب تكلفتها المعيارية.</li><li>اختبار استخلاص القهوة المقطرة بنسب TDS مختلفة وضبط كفاءة الاستخلاص.</li><li>تدريب الكادر على بطاقات الوصفات القياسية (Standard Recipe Cards).</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-rd-developer', 'مطور منتجات ووصفات (R&D)')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-content-creator" data-category="ops" data-status="vacant" data-original-title="صانع محتوى ومدير تواصل">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-video"></i> قسم التسويق والإعلام</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-camera"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">صانع محتوى ومدير تواصل</h3>
                        <div class="job-role-en">Social Content Creator & Specialist</div>
                    </div>
                </div>
                <div class="job-summary-desc">تصوير يوميات تحميص الحماصة الرائدة وحركة البار وإدارة منصات TikTok و Instagram.</div>
                <ul class="job-responsibilities-list">
                    <li>إنتاج فيديوهات ريلز وتيك توك جذابة تسلط الضوء على شغف الجودة بـ RoR.</li><li>التفاعل السريع والمهني مع استفسارات العملاء على الرسائل والتعليقات.</li><li>متابعة تقييمات Google Maps وتحفيز العملاء على ترك تعليقات إيجابية.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-content-creator', 'صانع محتوى ومدير تواصل')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-designer" data-category="ops" data-status="vacant" data-original-title="مصمم جرافيك وهوية بصرية">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-pen-nib"></i> قسم التصميم والهوية البصرية</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-palette"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">مصمم جرافيك وهوية بصرية</h3>
                        <div class="job-role-en">Graphic & Brand Identity Designer</div>
                    </div>
                </div>
                <div class="job-summary-desc">تصميم ملصقات أكياس المحاصيل وبوسترات القوائم المطبوعة والحملات الترويجية.</div>
                <ul class="job-responsibilities-list">
                    <li>تصميم بطاقات تعريف المحاصيل المطبوعة والمرفقة مع أرباع البن.</li><li>تحديث تصاميم شاشات العرض الرقمية للمنيو داخل الفرع.</li><li>توحيد الهوية البصرية عبر جميع نقاط التماس والتغليف.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-designer', 'مصمم جرافيك وهوية بصرية')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-b2b-rep" data-category="ops" data-status="vacant" data-original-title="ممثل مبيعات جملة (B2B Rep)">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-handshake"></i> قسم مبيعات الجملة B2B</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-briefcase"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">ممثل مبيعات جملة (B2B Rep)</h3>
                        <div class="job-role-en">B2B Wholesale Sales Executive</div>
                    </div>
                </div>
                <div class="job-summary-desc">استهداف 10 مقاهٍ محلية لتوريد محاصيل الحماصة الرائدة بعقود توريد شهرية منتظمة.</div>
                <ul class="job-responsibilities-list">
                    <li>تنفيذ زيارات ميدانية لأصحاب المقاهي والمطاعم وتقديم عينات التذوق.</li><li>إتمام صفقات التوريد الشهرية بمتوسط 50-100 كجم شهرياً لكل عميل.</li><li>متابعة تصريف طاقة المحمصة وتحقيق مستهدفات الإيراد بالجملة.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-b2b-rep', 'ممثل مبيعات جملة (B2B Rep)')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-kam" data-category="ops" data-status="vacant" data-original-title="مسؤول حسابات كبار العملاء">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-building-columns"></i> قسم كبار العملاء والشركات</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-handshake"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">مسؤول حسابات كبار العملاء</h3>
                        <div class="job-role-en">Key Account Manager (KAM)</div>
                    </div>
                </div>
                <div class="job-summary-desc">إدارة علاقات الفنادق والشركات الكبرى وعقود التوريد المستمرة ومتابعة التحصيل.</div>
                <ul class="job-responsibilities-list">
                    <li>إدارة وتجديد عقود الضيافة للجهات الحكومية والشركات الخاصة.</li><li>متابعة جداول تسليم البن الدورية وضمان رضا العملاء التام.</li><li>التنسيق مع الإدارة المالية لمتابعة الذمم المدينة وتحصيل المستحقات.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-kam', 'مسؤول حسابات كبار العملاء')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-ecom-manager" data-category="ops" data-status="vacant" data-original-title="مدير المتجر الإلكتروني">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-cart-shopping"></i> قسم التجارة الإلكترونية</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-shop"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">مدير المتجر الإلكتروني</h3>
                        <div class="job-role-en">E-Commerce Platform Manager</div>
                    </div>
                </div>
                <div class="job-summary-desc">إدارة منصة المتجر الرقمية، تجربة التسوق، ومزامنة توفر المحاصيل مع المحمصة.</div>
                <ul class="job-responsibilities-list">
                    <li>متابعة حركة الطلبات اليومية الرقمية ورفع معدل التحويل (Conversion Rate).</li><li>إطلاق أكواد الخصم الترويجية وحزم القهوة المنزلية المميزة.</li><li>تكامل بوابات الدفع الإلكتروني (مدى، تابي، تمارا، Apple Pay).</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-ecom-manager', 'مدير المتجر الإلكتروني')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-shipping" data-category="ops" data-status="vacant" data-original-title="أخصائي شحن ومخزون">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-truck-fast"></i> قسم الشحن والمستودعات</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-truck"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">أخصائي شحن ومخزون</h3>
                        <div class="job-role-en">Fulfillment & Inventory Specialist</div>
                    </div>
                </div>
                <div class="job-summary-desc">تجهيز بوالص الشحن السريع وتسليم الطرود لشركات النقل ومتابعة وصولها للعملاء.</div>
                <ul class="job-responsibilities-list">
                    <li>طباعة بوالص الشحن وتغليف الطلبيات في كراتين الشحن المعتمدة.</li><li>تنسيق مواعيد استلام مندوبي الشحن وحل أي تأخيرات لوجستية.</li><li>إجراء الجرد الأسبوعي لمخزون أكياس البن ومواد التغليف.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-shipping', 'أخصائي شحن ومخزون')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-green-buyer" data-category="ops" data-status="vacant" data-original-title="مسؤول مشتريات وتوريد بن أخضر">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-boxes-packing"></i> قسم المشتريات والتوريد وسلاسل الإمداد</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-seedling"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">مسؤول مشتريات وتوريد بن أخضر</h3>
                        <div class="job-role-en">Green Coffee Procurement Specialist</div>
                    </div>
                </div>
                <div class="job-summary-desc">التواصل مع مستوردي ومزارع البن الأخضر ومتابعة عقود التوريد المباشر ومستودع البن.</div>
                <ul class="job-responsibilities-list">
                    <li>التفاوض على أسعار شحنات البن الأخضر بالجملة وضمان شروط ائتمان ممتازة.</li><li>تتبع شحنات الموانئ والتخليص الجمركي واشتراطات هيئة الغذاء والدواء.</li><li>مراقبة درجات حرارة ورطوبة مستودع البن لحماية الجودة من التلف.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-green-buyer', 'مسؤول مشتريات وتوريد بن أخضر')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-tech" data-category="ops" data-status="vacant" data-original-title="فني صيانة آلات القهوة والمطاحن">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-wrench"></i> قسم الصيانة والدعم الفني</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-screwdriver-wrench"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">فني صيانة آلات القهوة والمطاحن</h3>
                        <div class="job-role-en">Coffee Equipment Maintenance Tech</div>
                    </div>
                </div>
                <div class="job-summary-desc">الصيانة الوقائية والطارئة لمكائن الإسبريسو ومطاحن ماهلكونيج والحماصة الرائدة.</div>
                <ul class="job-responsibilities-list">
                    <li>فحص دوري لضغط مضخات الإسبريسو ودرجة حرارة الغلايات وفلاتر المياه.</li><li>تنظيف ومعايرة شفرات طواحين الإسبريسو واستبدال الجوانات التالفة.</li><li>صيانة شعلات الغاز ومحركات تدوير الحماصة الرائدة لضمان السلامة.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-tech', 'فني صيانة آلات القهوة والمطاحن')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-hr-spec" data-category="ops" data-status="vacant" data-original-title="أخصائي موارد بشرية">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-users-gear"></i> قسم الموارد البشرية</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-id-card"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">أخصائي موارد بشرية</h3>
                        <div class="job-role-en">HR & Personnel Affairs Specialist</div>
                    </div>
                </div>
                <div class="job-summary-desc">إدارة شؤون الموظفين، عقود منصة قوى، التأمينات الاجتماعية، والامتثال لنظام العمل.</div>
                <ul class="job-responsibilities-list">
                    <li>توثيق عقود العمل عبر منصة قوى وإدارة ملفات الموظفين الرسمية.</li><li>متابعة الشهادات الصحية البلدية وتجديد إقامات العمالة النظامية.</li><li>حصر ساعات العمل والإجازات وتجهيز مسير الرواتب المعتمد شهرياً.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-hr-spec', 'أخصائي موارد بشرية')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-barista-trainer" data-category="ops" data-status="vacant" data-original-title="مدرب باريستا داخلي">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-chalkboard-user"></i> قسم التدريب وبناء القدرات</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-graduation-cap"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">مدرب باريستا داخلي</h3>
                        <div class="job-role-en">Head Barista & Internal Trainer</div>
                    </div>
                </div>
                <div class="job-summary-desc">تدريب الباريستا الجدد على معايير استخلاص RoR، سرعة الخدمة، وفن الرسم بالحليب.</div>
                <ul class="job-responsibilities-list">
                    <li>إقامة ورش تدريبية دورية لعارف وعلم والكوادر المنضمة حديثاً.</li><li>اختبار سرعة إعداد الأكواب تحت الضغط لتقليل زمن انتظار الزبائن.</li><li>تدريب الفريق على فنون الضيافة والتعامل مع ملاحظات العملاء بإيجابية.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-barista-trainer', 'مدرب باريستا داخلي')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
        <div class="org-job-card is-vacant" data-job-id="ops-cost-accountant" data-category="ops" data-status="vacant" data-original-title="محاسب عام وتكاليف">
            <div>
                <div class="card-top-meta">
                    <span class="job-dept-tag"><i class="fas fa-calculator"></i> قسم المالية والمحاسبة</span>
                    <span class="status-badge vacant"><i class="far fa-clock"></i> شاغر للتوظيف</span>
                </div>
                <div class="card-person-header">
                    <div class="avatar-square avatar-vacant"><i class="fas fa-file-invoice-dollar"></i></div>
                    <div class="person-name-title">
                        <h3 class="vacancy-holder-name">محاسب عام وتكاليف</h3>
                        <div class="job-role-en">General & Cost Accountant</div>
                    </div>
                </div>
                <div class="job-summary-desc">تسجيل القيود اليومية، حساب تكلفة كل كجم محمص وكوب قهوة، ومطابقة ضريبة ZATCA.</div>
                <ul class="job-responsibilities-list">
                    <li>حساب تكلفة الغذاء الدقيقة (Actual vs Ideal Food Cost) للمشروبات والحلى.</li><li>تسوية مبيعات البار اليومية ومطابقة إيداعات الشبكة والنقد بالخزينة.</li><li>إعداد إقرارات ضريبة القيمة المضافة ومطابقة الفواتير مع هيئة الزكاة.</li>
                </ul>
            </div>
            <div class="card-bottom-actions">
                <button class="btn-assign-action" onclick="triggerPositionAssign('ops-cost-accountant', 'محاسب عام وتكاليف')">
                    <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                </button>
            </div>
        </div>
    
                </div>
            </div>
        </div>
    `;
}

// ====== ORGANIZATIONAL BLUEPRINT SCRIPT LOGIC ======
function getOrgAssignedRoles() {
    try {
        const data = JSON.parse(localStorage.getItem('ror_org_structure') || '{"roles":[]}');
        return data.roles || [];
    } catch (e) {
        return [];
    }
}

function saveOrgAssignedRoles(roles) {
    localStorage.setItem('ror_org_structure', JSON.stringify({ roles }));
}

function recalculateOrgMetrics() {
    const totalJobs = 24;
    const baseOccupied = 6;
    const assignedRoles = getOrgAssignedRoles();
    const additionalOccupied = assignedRoles.length;
    const currentOccupied = Math.min(totalJobs, baseOccupied + additionalOccupied);
    const currentVacant = Math.max(0, totalJobs - currentOccupied);
    const ratioPercent = Math.round((currentOccupied / totalJobs) * 100);

    const kpiTotal = document.getElementById('kpiTotalJobs');
    const kpiOcc   = document.getElementById('kpiOccupiedJobs');
    const kpiVac   = document.getElementById('kpiVacantJobs');
    const kpiRat   = document.getElementById('kpiRatioText');
    const kpiBar   = document.getElementById('kpiRatioFill');

    if (kpiTotal) kpiTotal.textContent = totalJobs;
    if (kpiOcc)   kpiOcc.textContent   = currentOccupied;
    if (kpiVac)   kpiVac.textContent   = currentVacant;
    if (kpiRat)   kpiRat.textContent   = `${ratioPercent}%`;
    if (kpiBar)   kpiBar.style.width   = `${ratioPercent}%`;

    const pillAll = document.getElementById('pillCountAll');
    const pillOcc = document.getElementById('pillCountOccupied');
    const pillVac = document.getElementById('pillCountVacant');

    if (pillAll) pillAll.textContent = totalJobs;
    if (pillOcc) pillOcc.textContent = currentOccupied;
    if (pillVac) pillVac.textContent = currentVacant;
}

function refreshOrgCardsFromStorage() {
    const assigned = getOrgAssignedRoles();

    document.querySelectorAll('.org-job-card.is-vacant, .org-job-card[data-was-vacant="true"]').forEach(card => {
        card.setAttribute('data-was-vacant', 'true');
        const jobId = card.dataset.jobId;
        const assignedRole = assigned.find(r => r.id === jobId);

        const statusBadge = card.querySelector('.status-badge');
        const actionArea  = card.querySelector('.card-bottom-actions');
        const titleEl     = card.querySelector('.vacancy-holder-name');

        if (!card.dataset.originalTitle && titleEl) {
            card.dataset.originalTitle = titleEl.textContent;
        }
        const originalTitle = card.dataset.originalTitle || 'وظيفة شاغرة';

        if (assignedRole) {
            card.dataset.status = 'occupied';
            card.classList.remove('is-vacant');
            card.classList.add('is-occupied');
            card.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            card.style.background = '#FFFFFF';

            if (statusBadge) {
                statusBadge.className = 'status-badge occupied';
                statusBadge.innerHTML = `<span class="pulse-dot"></span> مشغول: ${assignedRole.holder}`;
            }

            if (actionArea) {
                actionArea.innerHTML = `
                    <div class="btn-assigned-done">
                        <span><i class="fas fa-user-check" style="margin-left:5px;"></i> ${assignedRole.holder} (${assignedRole.salary || 5000} ر.س)</span>
                        <span class="unassign-icon" title="إلغاء التسكين" onclick="unassignOrgPosition('${jobId}', '${assignedRole.holder}')">
                            <i class="fas fa-trash-can"></i>
                        </span>
                    </div>
                `;
            }
        } else {
            card.dataset.status = 'vacant';
            card.classList.add('is-vacant');
            card.classList.remove('is-occupied');
            card.style.borderColor = '';
            card.style.background = '';

            if (statusBadge) {
                statusBadge.className = 'status-badge vacant';
                statusBadge.innerHTML = '<i class="far fa-clock"></i> شاغر للتوظيف';
            }

            if (actionArea) {
                actionArea.innerHTML = `
                    <button class="btn-assign-action" onclick="triggerPositionAssign('${jobId}', '${originalTitle}')">
                        <i class="fas fa-user-plus"></i> <span>تسكين مرشح</span>
                    </button>
                `;
            }
        }
    });

    recalculateOrgMetrics();
}

window.triggerPositionAssign = function(positionId, positionTitle) {
    const titleEl = document.getElementById('positionTitle');
    if (titleEl) titleEl.textContent = positionTitle;

    const modal = document.getElementById('assignModal');
    const form  = document.getElementById('assignForm');
    if (modal && form) {
        form.dataset.positionId = positionId;
        modal.classList.add('active');
        const input = form.querySelector('[name="employeeName"]');
        if (input) {
            input.value = '';
            setTimeout(() => input.focus(), 50);
        }
    }
};

window.closeAssignModal = function() {
    const modal = document.getElementById('assignModal');
    if (modal) modal.classList.remove('active');
};

window.saveAssignment = function(event) {
    event.preventDefault();
    const form = event.target;
    const positionId = form.dataset.positionId;
    const employeeName = form.employeeName.value.trim();
    const startDate = form.startDate.value;
    const salary = parseInt(form.salary.value) || 5000;

    if (!employeeName || !positionId) return;

    let roles = getOrgAssignedRoles();
    roles = roles.filter(r => r.id !== positionId);
    roles.push({
        id: positionId,
        holder: employeeName,
        startDate: startDate,
        salary: salary,
        assignedAt: new Date().toISOString()
    });

    saveOrgAssignedRoles(roles);
    closeAssignModal();
    refreshOrgCardsFromStorage();
};

window.unassignOrgPosition = function(positionId, employeeName) {
    if (!confirm(`هل أنت متأكد من إلغاء تسكين الموظف (${employeeName}) وإعادة الوظيفة لقائمة الشواغر؟`)) {
        return;
    }

    let roles = getOrgAssignedRoles();
    roles = roles.filter(r => r.id !== positionId);
    saveOrgAssignedRoles(roles);
    refreshOrgCardsFromStorage();
};

window.filterBlueprint = function(filter, btn) {
    document.querySelectorAll('#blueprintFilterPills .filter-pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.org-job-card');
    const secExec = document.getElementById('section-exec');
    const secBar = document.getElementById('section-bar');
    const secOps = document.getElementById('section-ops');

    cards.forEach(card => {
        const category = card.dataset.category;
        const status = card.dataset.status;
        let show = false;

        if (filter === 'all') show = true;
        else if (filter === 'occupied') show = (status === 'occupied');
        else if (filter === 'vacant') show = (status === 'vacant');
        else if (filter === category) show = true;

        card.style.display = show ? 'flex' : 'none';
    });

    if (secExec) {
        const hasVisible = secExec.querySelector('.org-job-card[style*="display: flex"]') || (filter === 'all' || filter === 'exec' || filter === 'occupied');
        secExec.style.display = hasVisible ? '' : 'none';
    }
    if (secBar) {
        const hasVisible = secBar.querySelector('.org-job-card[style*="display: flex"]') || (filter === 'all' || filter === 'bar' || filter === 'occupied' || filter === 'vacant');
        secBar.style.display = hasVisible ? '' : 'none';
    }
    if (secOps) {
        const hasVisible = secOps.querySelector('.org-job-card[style*="display: flex"]') || (filter === 'all' || filter === 'ops' || filter === 'vacant');
        secOps.style.display = hasVisible ? '' : 'none';
    }
};

window.searchBlueprint = function(query) {
    const q = (query || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.org-job-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(q);
        card.style.display = matches ? 'flex' : 'none';
    });
};

// ====== TEAM ROLES ======
function getTeamRolesContent() {
    const team = [
        {
            name: 'علاء يوسف', initial: 'ع', position: 'مدير العمليات والتطوير',
            responsibilities: ['الإشراف على جميع العمليات', 'التحميص وضبط الجودة', 'تطوير المنتجات والخلطات', 'اتخاذ القرارات الاستراتيجية', 'إعداد التقارير للشركاء']
        },
        {
            name: 'أبو محمد', initial: 'م', position: 'مدير المبيعات وتطوير الأعمال',
            responsibilities: ['بناء علاقات العملاء B2B', 'زيارات ميدانية للعملاء المحتملين', 'التفاوض والإغلاق', 'تحديث CRM', 'تقارير المبيعات الشهرية']
        },
        {
            name: 'جود', initial: 'ج', position: 'الإدارة المالية والمخزون',
            responsibilities: ['تسجيل المعاملات اليومية', 'إعداد التقارير المالية', 'إدارة المخزون والطلبات', 'متابعة الذمم المدينة', 'إعداد الميزانيات']
        },
        {
            name: 'أنس', initial: 'أ', position: 'التخطيط الاستراتيجي والمالي',
            responsibilities: ['تحليل البيانات والKPIs', 'التخطيط الاستراتيجي', 'تحليل التكاليف والربحية', 'دعم القرارات بالبيانات', 'متابعة مؤشرات الأداء']
        },
        {
            name: 'عارف', initial: 'ع', position: 'رئيس البار والخدمة',
            responsibilities: ['الإشراف على عمليات البار', 'تدريب الباريستا', 'ضمان جودة المشروبات', 'تطوير قائمة المشروبات', 'خدمة العملاء المتميزة']
        },
        {
            name: 'علم', initial: 'ل', position: 'الصيانة والدعم الفني',
            responsibilities: ['صيانة يومية لماكينة الإسبريسو', 'صيانة المطاحن والمعدات', 'فحص المحمصة الدوري', 'سجل الصيانة', 'الدعم الفني الطارئ']
        }
    ];

    return `
        <div class="page-header">
            <h2 class="page-title">مهام فريق RoR</h2>
            <p class="page-subtitle">توصيف وظيفي تفصيلي لكل عضو في الفريق</p>
        </div>

        <div class="team-grid">
            ${team.map(m => `
                <div class="team-card">
                    <div class="team-card-header">
                        <div class="team-avatar">${m.initial}</div>
                        <div>
                            <div class="team-name">${m.name}</div>
                            <div class="team-position">${m.position}</div>
                        </div>
                    </div>
                    <div class="team-responsibilities">
                        <h4>المهام والمسؤوليات</h4>
                        <ul>${m.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ====== MIND MAP ======
function getMindMapContent() {
    const branches = [
        { title: 'الإنتاج',        items: ['التحميص', 'ضبط الجودة', 'التغليف', 'خلطات جديدة'] },
        { title: 'المبيعات',       items: ['B2B جملة', 'البار', 'أونلاين', 'نقاط بيع'] },
        { title: 'التسويق',        items: ['Instagram', 'TikTok', 'Google', 'مؤثرون'] },
        { title: 'المالية',        items: ['تقارير يومية', 'KPIs', 'تدفق نقدي', 'ميزانية'] },
        { title: 'الفريق',         items: ['التدريب', 'الجداول', 'التقييم', 'الرواتب'] },
        { title: 'التطوير',        items: ['منتجات جديدة', 'توسع فروع', 'تصدير', 'برامج ولاء'] },
        { title: 'الجودة',         items: ['Cupping', 'SOP', 'معايير', 'شكاوى'] },
        { title: 'اللوجستيات',    items: ['الشحن', 'المخزون', 'الموردون', 'التوصيل'] }
    ];

    return `
        <div class="page-header">
            <h2 class="page-title">الخريطة الذهنية لـ RoR</h2>
            <p class="page-subtitle">رؤية شاملة لجميع محاور العمل</p>
        </div>

        <div class="mind-map-container">
            <div class="mind-map-center">
                <div>
                    <i class="fas fa-mug-hot" style="font-size:2rem;display:block;margin-bottom:0.4rem"></i>
                    <strong>RoR System</strong>
                </div>
            </div>
            <div class="mind-map-branches">
                ${branches.map(b => `
                    <div class="mind-branch">
                        <h4><i class="fas fa-chevron-left" style="font-size:0.7rem;margin-left:0.25rem"></i> ${b.title}</h4>
                        <ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ====== DEVELOPMENT ======
function getDevelopmentContent() {
    const cards = [
        { icon:'fa-graduation-cap', title:'تطوير الكوادر البشرية',    desc:'برامج تدريب متخصصة للباريستا والمحمصين على أحدث المعايير العالمية في صناعة القهوة المتخصصة.',   progress: 35 },
        { icon:'fa-laptop-code',    title:'التحول الرقمي',             desc:'اعتماد أنظمة POS متقدمة، وإدارة المخزون ذكياً، وبناء منصة تجارة إلكترونية متكاملة.',          progress: 50 },
        { icon:'fa-globe',          title:'التوسع الجغرافي',           desc:'دراسة جدوى لفتح فروع جديدة في أحياء مختارة، ومحطات تحميص متنقلة.',                             progress: 15 },
        { icon:'fa-certificate',    title:'الشهادات والاعتمادات',      desc:'استهداف شهادة Q Grader والاعتماد من السنتر فور كوفي، لتعزيز مكانة العلامة التجارية.',          progress: 20 },
        { icon:'fa-leaf',           title:'الاستدامة',                 desc:'اعتماد مبادئ البيئة المستدامة: تغليف قابل للتحلل، ومصادر بن أخلاقية، وتقليل البصمة الكربونية.',progress: 10 },
        { icon:'fa-handshake',      title:'الشراكات الاستراتيجية',     desc:'بناء شراكات مع فنادق ومطاعم وشركات طيران لتوفير قهوة RoR كخيار رئيسي في المنشآت الفندقية.',   progress: 25 }
    ];

    return `
        <div class="page-header">
            <h2 class="page-title">التطوير والنمو</h2>
            <p class="page-subtitle">خارطة طريق التطوير المؤسسي ومبادرات النمو المستقبلية</p>
        </div>

        <div class="alert info">
            <i class="fas fa-info-circle"></i>
            <div><strong>ملاحظة:</strong> هذه المبادرات تُنفَّذ بالتوازي مع العمليات اليومية — الأرقام تعكس نسبة التقدم الحالية</div>
        </div>

        <div class="dev-grid">
            ${cards.map(c => `
                <div class="dev-card">
                    <div class="dev-card-icon"><i class="fas ${c.icon}"></i></div>
                    <h3>${c.title}</h3>
                    <p>${c.desc}</p>
                    <div class="progress-container" style="margin-bottom:0">
                        <div class="progress-label">
                            <span>التقدم</span><span>${c.progress}%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width:${c.progress}%"></div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="table-card" style="margin-top:2rem">
            <div class="table-header"><h3 class="table-title">أهداف النمو السنوية (2024)</h3></div>
            <div class="table-responsive">
                <table>
                    <thead><tr><th>الهدف</th><th>الحالي</th><th>المستهدف</th><th>النسبة</th><th>الحالة</th></tr></thead>
                    <tbody>
                        <tr><td>الإيرادات السنوية</td><td>820,000 ريال</td><td>1,440,000 ريال</td><td>57%</td><td><span class="badge warning">قيد التنفيذ</span></td></tr>
                        <tr><td>عملاء B2B</td><td>8</td><td>25</td><td>32%</td><td><span class="badge warning">قيد التنفيذ</span></td></tr>
                        <tr><td>متابعو السوشيال ميديا</td><td>1,200</td><td>10,000</td><td>12%</td><td><span class="badge danger">متأخر</span></td></tr>
                        <tr><td>نقاط البيع</td><td>2</td><td>10</td><td>20%</td><td><span class="badge warning">قيد التنفيذ</span></td></tr>
                        <tr><td>إنتاج شهري (كجم)</td><td>195</td><td>400</td><td>49%</td><td><span class="badge warning">قيد التنفيذ</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
