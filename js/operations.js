/**
 * RoR Enterprise Suite - Operations & Financial Analysis Engine
 * System Version: 2.4.0-MODULAR
 * Modules: 40-Task Tracker, Dynamic Break-Even, 2D Menu Matrix, Waste Logs, RACI, Financials
 */

// ===================================================================
// 1. DASHBOARD WITH DYNAMIC DAILY BREAK-EVEN INDICATOR
// ===================================================================
function getDashboardContent() {
    const cafeSales = window.DataService.getCafeSales();
    const roastSales = window.DataService.getRoasterySales();
    const breakevenCfg = window.DataService.getBreakevenConfig();

    // Dynamic Today's Date String (always uses current local date)
    const todayDate = new Date();
    const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth()+1).padStart(2,'0')}-${String(todayDate.getDate()).padStart(2,'0')}`;

    // Calculate Today's combined revenue
    const todayCafeRev = cafeSales.filter(s => s.date === todayStr).reduce((sum, s) => sum + (parseFloat(s.revenue) || 0), 0);
    const todayRoastRev = roastSales.filter(r => r.date === todayStr).reduce((sum, r) => sum + (parseFloat(r.paid) || 0), 0);
    const totalTodaySales = todayCafeRev + todayRoastRev;

    // Daily operational cost floor from Break-Even
    const dailyCostFloor = Math.round((breakevenCfg.fixedCosts / (1 - breakevenCfg.variableRatio)) / 30);
    const isFloorPassed = totalTodaySales >= dailyCostFloor;
    const variance = totalTodaySales - dailyCostFloor;

    const totalOrdersToday = cafeSales.filter(s => s.date === todayStr).reduce((sum, s) => sum + (parseInt(s.tickets) || 0), 0) + roastSales.filter(r => r.date === todayStr).length;

    return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
                <h2 class="page-title">مرحباً بك في نظام RoR التشغيلي المتكامل</h2>
                <p class="page-subtitle">نظرة عامة على أداء المقهى، الحماصة الرائدة، والمؤشرات التشغيلية الحية — ${new Date().toLocaleDateString('ar-SA-u-nu-latn', {year:'numeric',month:'long',day:'numeric'})}</p>
            </div>
            <!-- Dynamic Daily Cost Floor Pill -->
            <div class="${isFloorPassed ? 'daily-floor-badge passed' : 'daily-floor-badge below'}">
                <i class="fas ${isFloorPassed ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
                <span>
                    ${isFloorPassed 
                        ? `تم تجاوز سقف التكلفة اليومي بنجاح (+${variance.toLocaleString('en-US')} ر.س فائض أمان)`
                        : `المبيعات الحالية تحت سقف التعادل اليومي (متبقي ${Math.abs(variance).toLocaleString('en-US')} ر.س للتعادل)`
                    }
                </span>
            </div>
        </div>

        <!-- 4 Core Metric KPI Cards -->
        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header">
                    <span class="stat-title">إجمالي مبيعات اليوم (البار + المحمصة)</span>
                    <div class="stat-icon primary"><i class="fas fa-cash-register"></i></div>
                </div>
                <div class="stat-value">${totalTodaySales.toLocaleString('en-US')} ر.س</div>
                <div class="stat-change positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>البار: ${todayCafeRev.toLocaleString('en-US')} ر.س | المحمصة: ${todayRoastRev.toLocaleString('en-US')} ر.س</span>
                </div>
            </div>

            <div class="stat-card success">
                <div class="stat-header">
                    <span class="stat-title">عدد العمليات والطلبات</span>
                    <div class="stat-icon success"><i class="fas fa-receipt"></i></div>
                </div>
                <div class="stat-value">${totalOrdersToday || 54} طلب</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>معدل تدفق متوازن</span></div>
            </div>

            <div class="stat-card warning">
                <div class="stat-header">
                    <span class="stat-title">سقف التكلفة اليومي للتعادل</span>
                    <div class="stat-icon warning"><i class="fas fa-scale-balanced"></i></div>
                </div>
                <div class="stat-value">${dailyCostFloor.toLocaleString('en-US')} ر.س</div>
                <div class="stat-change"><span>تغطية الإيجار، الرواتب، والخامات</span></div>
            </div>

            <div class="stat-card info">
                <div class="stat-header">
                    <span class="stat-title">الحماصة الرائدة</span>
                    <div class="stat-icon primary"><i class="fas fa-fire-burner"></i></div>
                </div>
                <div class="stat-value">جاهزية 100%</div>
                <div class="stat-change positive"><span>معدل الفقد الطبيعي (<14.5%)</span></div>
            </div>
        </div>

        <!-- Revenue Charts Grid -->
        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title"><i class="fas fa-chart-line" style="color:#0284C7;margin-left:6px;"></i> مسار مبيعات الأسبوع (ريال سعودي)</h3>
                </div>
                <div class="chart-container"><canvas id="weekSalesChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title"><i class="fas fa-chart-pie" style="color:#10B981;margin-left:6px;"></i> توزيع مصادر الإيراد (المقهى vs المحمصة)</h3>
                </div>
                <div class="chart-container"><canvas id="productDistChart"></canvas></div>
            </div>
        </div>

        <!-- Recent Operations Table -->
        <div class="table-card">
            <div class="table-header">
                <div>
                    <h3 class="table-title">سجل العمليات التشغيلية الأخيرة</h3>
                    <p style="margin:4px 0 0 0;font-size:0.8rem;color:#64748B;">بيانات مسجلة وموثقة من قبل الشركاء وفريق البار</p>
                </div>
                <button type="button" class="btn btn-outline" onclick="loadPage('40-tasks')"><i class="fas fa-list-check"></i> خطة الـ 40 مهمة</button>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>الوقت</th>
                            <th>النشاط التشغيلي</th>
                            <th>القسم</th>
                            <th>المسؤول</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>08:00 ص</td><td>افتتاح البار ومعايرة طواحين الإسبريسو والفلتر</td><td>المقهى والبار</td><td><strong style="color:#0284C7;">عارف</strong></td><td><span class="badge success">مكتمل</span></td></tr>
                        <tr><td>10:30 ص</td><td>تحميص دفعة شلشلي 50 كجم على الحماصة الرائدة</td><td>المحمصة والإنتاج</td><td><strong style="color:#0284C7;">علاء يوسف</strong></td><td><span class="badge success">مكتمل</span></td></tr>
                        <tr><td>12:45 ظ</td><td>توريد دفعة جملة لمقهى الأفق (حائل) 50 كجم</td><td>المبيعات B2B</td><td><strong style="color:#0284C7;">جود القصير</strong></td><td><span class="badge success">مكتمل</span></td></tr>
                        <tr><td>04:00 ع</td><td>استلام الوردية المسائية وإعادة ضبط استخلاص الفلات وايت</td><td>المقهى والبار</td><td><strong style="color:#0284C7;">علم</strong></td><td><span class="badge success">مكتمل</span></td></tr>
                        <tr><td>06:30 م</td><td>مراجعة التدفق النقدي وإغلاق صندوق النثرية اليومي</td><td>المالية</td><td><strong style="color:#0284C7;">أنس الصفدي</strong></td><td><span class="badge success">مكتمل</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ===================================================================
// 2. KPI DASHBOARD
// ===================================================================
function getKPIDashboardContent() {
    return `
        <div class="page-header">
            <h2 class="page-title">مؤشرات الأداء الرئيسية (KPIs)</h2>
            <p class="page-subtitle">تتبع دقيق لأهم مقاييس الأداء المالي والتشغيلي لمقهى ومحمصة RoR</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header"><span class="stat-title">إجمالي المبيعات (شهري)</span><div class="stat-icon primary"><i class="fas fa-chart-line"></i></div></div>
                <div class="stat-value">68,500 ر.س</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>15% عن الشهر الماضي</span></div>
            </div>
            <div class="stat-card success">
                <div class="stat-header"><span class="stat-title">هامش الربح الإجمالي</span><div class="stat-icon success"><i class="fas fa-percentage"></i></div></div>
                <div class="stat-value">44%</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>3% تحسن في التكاليف</span></div>
            </div>
            <div class="stat-card warning">
                <div class="stat-header"><span class="stat-title">التكاليف التشغيلية الثابتة</span><div class="stat-icon warning"><i class="fas fa-wallet"></i></div></div>
                <div class="stat-value">28,000 ر.س</div>
                <div class="stat-change"><span>إيجار، رواتب، وكهرباء</span></div>
            </div>
            <div class="stat-card info">
                <div class="stat-header"><span class="stat-title">صافي الدخل التشغيلي</span><div class="stat-icon success"><i class="fas fa-money-bill-wave"></i></div></div>
                <div class="stat-value">16,850 ر.س</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>أعلى من نقطة التعادل</span></div>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">المؤشرات التشغيلية الميدانية</h3></div>
            ${[
                { label: 'كفاءة تشغيل الحماصة الرائدة', val: 94 },
                { label: 'رضا العملاء الميداني', val: 95 },
                { label: 'معدل دوران أكياس البن (250جم)', val: 82 },
                { label: 'انضباط ورديات البار (عارف وعلم)', val: 98 }
            ].map(k => `
                <div class="progress-container">
                    <div class="progress-label"><span>${k.label}</span><span>${k.val}%</span></div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${k.val}%"></div></div>
                </div>
            `).join('')}
        </div>

        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title">اتجاه المبيعات الإجمالية</h3></div>
                <div class="chart-container"><canvas id="salesTrendChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title">مقارنة الإيرادات والتكاليف</h3></div>
                <div class="chart-container"><canvas id="revenueCostChart"></canvas></div>
            </div>
        </div>
    `;
}

// ===================================================================
// 3. WEEKLY PLAN
// ===================================================================
function getWeeklyPlanContent() {
    const tasks = [
        { title: 'تحميص 50 كجم على الحماصة الرائدة لطلبات الجملة', days: 'الأحد - الاثنين', owner: 'علاء يوسف', priority: 'high', done: true },
        { title: 'متابعة عقود توريد B2B مع مقهى الأفق وسلسلة نجد', days: 'الاثنين - الثلاثاء', owner: 'جود القصير', priority: 'high', done: true },
        { title: 'جرد مخزون الحليب والأكواب وأكياس الأرباع (250جم)', days: 'الأربعاء', owner: 'عبد الله القصير', priority: 'medium', done: false },
        { title: 'إعداد المطابقة البنكية الأسبوعية وتقارير نقاط البيع', days: 'الخميس', owner: 'أنس الصفدي', priority: 'high', done: false },
        { title: 'صيانة وقائية وتنظيف شفرات طواحين الإسبريسو بالبار', days: 'الجمعة', owner: 'عبد الله القصير', priority: 'medium', done: false }
    ];
    const done = tasks.filter(t => t.done).length;
    const pct  = Math.round((done / tasks.length) * 100);

    return `
        <div class="page-header">
            <h2 class="page-title">الخطة الأسبوعية التشغيلية</h2>
            <p class="page-subtitle">جدولة الأولويات الميدانية والإدارية للشركاء المؤسسين</p>
        </div>

        <div class="table-card" style="margin-bottom:1.5rem;">
            <div class="table-header">
                <div>
                    <h3 class="table-title">معدل إنجاز المهام الأسبوعية</h3>
                    <p style="margin:4px 0 0 0;font-size:0.8rem;color:#64748B;">تم إنجاز ${done} من أصل ${tasks.length} مهام معتمدة</p>
                </div>
                <span style="font-weight:800;color:#0284C7;font-size:1.1rem;">${pct}%</span>
            </div>
            <div class="progress-bar-bg" style="height:10px;">
                <div class="progress-bar-fill" style="width:${pct}%;background:linear-gradient(90deg, #0284C7, #10B981);"></div>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">مهام الأسبوع الجاري</h3>
            </div>
            <div class="task-list">
                ${tasks.map((t, i) => `
                    <div class="task-item">
                        <input type="checkbox" class="task-checkbox" id="wt-${i}" ${t.done ? 'checked' : ''} aria-label="${t.title}">
                        <div class="task-content">
                            <div class="task-title" style="${t.done ? 'text-decoration:line-through;opacity:0.6' : ''}">${t.title}</div>
                            <div class="task-meta">
                                <span><i class="fas fa-calendar-day"></i> ${t.days}</span>
                                <span><i class="fas fa-user-tie"></i> ${t.owner}</span>
                                <span class="task-priority ${t.priority}">${t.priority === 'high' ? 'أولوية عالية' : 'أولوية متوسطة'}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ===================================================================
// 4. 40 OPERATIONAL TASKS (WEEKS 1-8 BLUEPRINT)
// ===================================================================
function get40TasksContent() {
    const tasks = window.DataService.getTasks();

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const pendingCount = tasks.filter(t => t.status === 'pending' || t.status === 'scheduled').length;
    const progressPct = Math.round((completedCount / tasks.length) * 100);

    return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
                <h2 class="page-title">خطة الـ 40 مهمة التشغيلية المعتمدة</h2>
                <p class="page-subtitle">خارطة طريق التطوير وإعادة الهيكلة الشاملة لمقهى ومحمصة RoR (مقسمة على 8 أسابيع متتالية)</p>
            </div>
            <div style="display:flex;gap:8px;">
                <button type="button" class="btn btn-outline" onclick="window.print()"><i class="fas fa-print"></i> طباعة الخطة</button>
            </div>
        </div>

        <!-- KPI Summary Cards -->
        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header">
                    <span class="stat-title">إجمالي المهام المعتمدة</span>
                    <div class="stat-icon primary"><i class="fas fa-list-check"></i></div>
                </div>
                <div class="stat-value">${tasks.length} مهمة</div>
                <div class="stat-change"><span>8 أسابيع تشغيلية متكاملة</span></div>
            </div>

            <div class="stat-card success">
                <div class="stat-header">
                    <span class="stat-title">المهام المنجزة بنجاح</span>
                    <div class="stat-icon success"><i class="fas fa-circle-check"></i></div>
                </div>
                <div class="stat-value">${completedCount} مهمة</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>${progressPct}% نسبة الإنجاز التراكمي</span></div>
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
                        <button type="button" class="filter-pill-btn active" onclick="filter40Tasks('all', this)">الكل (${tasks.length})</button>
                        <button type="button" class="filter-pill-btn" onclick="filter40Tasks('w1-2', this)">الأسابيع 1-2 (10)</button>
                        <button type="button" class="filter-pill-btn" onclick="filter40Tasks('w3-4', this)">الأسابيع 3-4 (10)</button>
                        <button type="button" class="filter-pill-btn" onclick="filter40Tasks('w5-6', this)">الأسابيع 5-6 (10)</button>
                        <button type="button" class="filter-pill-btn" onclick="filter40Tasks('w7-8', this)">الأسابيع 7-8 (10)</button>
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
                            <th style="width:140px;">الحالة التفاعلية</th>
                        </tr>
                    </thead>
                    <tbody id="tasksTableBody">
                        ${tasks.map(t => {
                            const isDone = t.status === 'completed';
                            const isInProg = t.status === 'in-progress';
                            return `
                                <tr data-week="${t.week}" data-status="${t.status}" data-cat="${t.cat}">
                                    <td style="font-weight:700;color:#64748B;">#${t.id}</td>
                                    <td><span class="badge badge-oxford" style="font-weight:600;">الأسبوع ${t.week}</span></td>
                                    <td style="font-weight:600;color:${isDone ? '#64748B' : '#0F172A'};text-decoration:${isDone ? 'line-through' : 'none'};">${t.task}</td>
                                    <td><span class="badge badge-subtle" style="font-size:0.75rem;">${t.cat}</span></td>
                                    <td><strong style="color:#0284C7;"><i class="fas fa-user-circle" style="margin-left:4px;"></i>${t.responsible}</strong></td>
                                    <td>
                                        <select onchange="window.DataService.updateTaskStatus(${t.id}, this.value); loadPage('40-tasks');" style="font-size:0.78rem;padding:4px 8px;border-radius:6px;border:1px solid #CBD5E1;background:${isDone ? '#DCFCE7' : isInProg ? '#E0F2FE' : '#FEF3C7'};color:${isDone ? '#16A34A' : isInProg ? '#0284C7' : '#D97706'};font-weight:700;cursor:pointer;">
                                            <option value="completed" ${isDone ? 'selected' : ''}>مكتمل</option>
                                            <option value="in-progress" ${isInProg ? 'selected' : ''}>قيد التنفيذ</option>
                                            <option value="pending" ${t.status === 'pending' || t.status === 'scheduled' ? 'selected' : ''}>مجدول</option>
                                        </select>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

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

// ===================================================================
// 5. MENU ENGINEERING (OFFICIAL 2D MATRIX)
// ===================================================================
function getMenuEngineeringContent() {
    const menuItems = window.DataService.getMenuItems();

    const starsCount = menuItems.filter(m => m.classType === 'stars').length;
    const plowCount = menuItems.filter(m => m.classType === 'plowhorses').length;
    const puzzlesCount = menuItems.filter(m => m.classType === 'puzzles').length;
    const dogsCount = menuItems.filter(m => m.classType === 'dogs').length;

    return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
                <h2 class="page-title">هندسة القائمة ومصفوفة الربحية (Menu Engineering)</h2>
                <p class="page-subtitle">المصفوفة الثنائية (2D Matrix) لتصنيف أصناف المنيو وفق الشعبية الميدانية وهامش المساهمة الربحي</p>
            </div>
            <div style="display:flex;gap:8px;">
                <button type="button" class="btn btn-primary" onclick="openMenuItemModal()"><i class="fas fa-plus"></i> إضافة صنف للمنيو</button>
            </div>
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
                    <strong>القرار التشغيلي:</strong> حماية معايير الجودة وثبات معايرة الاستخلاص وضمان وفرة المحصول دون انقطاع.
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
                    <strong>القرار التشغيلي:</strong> تفعيل أساليب البيع المقترح (Upselling) بواسطة باريستا الكاشير وعينات تذوق.
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
                            const contribPct = (((m.price - m.cost) / m.price) * 100).toFixed(1);
                            return `
                                <tr>
                                    <td style="font-weight:700;color:#0F172A;"><i class="fas fa-mug-hot" style="color:#0284C7;margin-left:6px;"></i>${m.name}</td>
                                    <td><span class="badge badge-subtle">${m.category}</span></td>
                                    <td style="font-weight:700;color:#0F172A;">${parseFloat(m.price).toFixed(2)} ر.س</td>
                                    <td style="color:#64748B;">${parseFloat(m.cost).toFixed(2)} ر.س</td>
                                    <td style="font-weight:800;color:#10B981;">+${margin} ر.س</td>
                                    <td style="font-weight:700;color:#0284C7;">${contribPct}%</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:6px;">
                                            <span style="font-weight:700;width:18px;">${m.popularity}</span>
                                            <div class="progress-bar-bg" style="width:70px;height:6px;margin:0;">
                                                <div class="progress-bar-fill" style="width:${m.popularity * 10}%;background:#0284C7;"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span class="badge ${m.badge || 'badge-green'}"><i class="fas ${m.icon || 'fa-star'}" style="margin-left:4px;"></i>${m.label || 'نجم'}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ===================================================================
// 6. DYNAMIC BREAK-EVEN ANALYSIS WITH LIVE SLIDERS
// ===================================================================
function getBreakevenContent() {
    const cfg = window.DataService.getBreakevenConfig();

    return `
        <div class="page-header">
            <h2 class="page-title">نموذج نقطة التعادل التفاعلي (Dynamic Break-Even Model)</h2>
            <p class="page-subtitle">محاكاة حية لتحديد حجم المبيعات والأكواب المطلوبة لتغطية التكاليف وتحقيق هوامش الربح المستهدفة</p>
        </div>

        <!-- Interactive Slider Controls Card -->
        <div class="breakeven-slider-card">
            <h3 style="font-size:1rem;font-weight:700;color:#0F172A;margin-bottom:0.5rem;"><i class="fas fa-sliders" style="color:#0284C7;margin-left:6px;"></i> لوحة التحكم في متغيرات التكلفة والأسعار</h3>
            <p style="font-size:0.8rem;color:#64748B;margin-bottom:1rem;">قم بتحريك المؤشرات لحساب نقطة التعادل الشهرية واليومية وعدد الأكواب فورياً:</p>

            <div class="slider-group">
                <!-- 1. Fixed Costs Slider -->
                <div class="slider-box">
                    <div class="slider-box-header">
                        <span class="slider-box-title">التكاليف الثابتة الشهرية (إيجار + رواتب + كهرباء)</span>
                        <span class="slider-box-val" id="valFixedCosts">${cfg.fixedCosts.toLocaleString('en-US')} ر.س</span>
                    </div>
                    <input type="range" class="slider-input" id="sliderFixedCosts" min="15000" max="50000" step="1000" value="${cfg.fixedCosts}" oninput="updateBreakevenCalc()">
                    <div class="slider-minmax"><span>15,000 ر.س</span><span>50,000 ر.س</span></div>
                </div>

                <!-- 2. Average Cup Price Slider -->
                <div class="slider-box">
                    <div class="slider-box-header">
                        <span class="slider-box-title">متوسط سعر بيع الكوب / الطلب</span>
                        <span class="slider-box-val" id="valAvgCupPrice">${cfg.avgCupPrice} ر.س</span>
                    </div>
                    <input type="range" class="slider-input" id="sliderAvgCupPrice" min="10" max="30" step="1" value="${cfg.avgCupPrice}" oninput="updateBreakevenCalc()">
                    <div class="slider-minmax"><span>10 ر.س</span><span>30 ر.س</span></div>
                </div>

                <!-- 3. Variable Cost Ratio Slider -->
                <div class="slider-box">
                    <div class="slider-box-header">
                        <span class="slider-box-title">نسبة التكاليف المتغيرة (بن + حليب + تغليف)</span>
                        <span class="slider-box-val" id="valVariableRatio">${Math.round(cfg.variableRatio * 100)}%</span>
                    </div>
                    <input type="range" class="slider-input" id="sliderVariableRatio" min="25" max="60" step="1" value="${Math.round(cfg.variableRatio * 100)}" oninput="updateBreakevenCalc()">
                    <div class="slider-minmax"><span>25%</span><span>60%</span></div>
                </div>
            </div>
        </div>

        <!-- Calculated Live Metrics Grid -->
        <div class="stats-grid" id="breakevenMetricsGrid">
            <div class="stat-card primary">
                <div class="stat-header"><span class="stat-title">هامش المساهمة (Contribution Margin)</span><div class="stat-icon primary"><i class="fas fa-percentage"></i></div></div>
                <div class="stat-value" id="calcContribMargin">${Math.round((1 - cfg.variableRatio) * 100)}%</div>
                <p style="margin-top:0.5rem;font-size:0.8rem;color:#64748B;" id="calcContribSAR">هامش الكوب: ${(cfg.avgCupPrice * (1 - cfg.variableRatio)).toFixed(2)} ر.س</p>
            </div>

            <div class="stat-card danger">
                <div class="stat-header"><span class="stat-title">نقطة التعادل الشهرية (Break-Even)</span><div class="stat-icon danger"><i class="fas fa-balance-scale"></i></div></div>
                <div class="stat-value" id="calcMonthlyBreakeven">0 ر.س</div>
                <p style="margin-top:0.5rem;font-size:0.8rem;color:#64748B;">المبيعات لتغطية التكاليف بالكامل</p>
            </div>

            <div class="stat-card warning">
                <div class="stat-header"><span class="stat-title">المبيعات اليومية المطلوبة</span><div class="stat-icon warning"><i class="fas fa-calendar-day"></i></div></div>
                <div class="stat-value" id="calcDailyBreakeven">0 ر.س</div>
                <p style="margin-top:0.5rem;font-size:0.8rem;color:#64748B;">سقف التكلفة اليومي للتشغيل</p>
            </div>

            <div class="stat-card success">
                <div class="stat-header"><span class="stat-title">عدد الأكواب اليومية المطلوبة</span><div class="stat-icon success"><i class="fas fa-mug-hot"></i></div></div>
                <div class="stat-value" id="calcDailyCups">0 كوب</div>
                <p style="margin-top:0.5rem;font-size:0.8rem;color:#64748B;">بمعدل السعر المحدد</p>
            </div>
        </div>

        <!-- Profit Target Matrix Table -->
        <div class="table-card" style="margin-top:1.5rem;">
            <div class="table-header">
                <h3 class="table-title">المبيعات المطلوبة لتحقيق مستويات أرباح صافية محددة</h3>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>الهدف الربحي الصافي</th>
                            <th>المبيعات الشهرية المستهدفة</th>
                            <th>المبيعات اليومية المطلوبة</th>
                            <th>عدد الأكواب اليومية</th>
                            <th>الحالة والتقييم</th>
                        </tr>
                    </thead>
                    <tbody id="profitTargetTableBody">
                        <!-- Populated by updateBreakevenCalc() -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.initializeBreakevenSliders = function() {
    updateBreakevenCalc();
};

window.updateBreakevenCalc = function() {
    const sFixed = document.getElementById('sliderFixedCosts');
    const sPrice = document.getElementById('sliderAvgCupPrice');
    const sRatio = document.getElementById('sliderVariableRatio');
    if (!sFixed || !sPrice || !sRatio) return;

    const fixedCosts = parseFloat(sFixed.value);
    const avgPrice = parseFloat(sPrice.value);
    const varRatio = parseFloat(sRatio.value) / 100;
    const contribMargin = 1 - varRatio;

    // Save to service
    window.DataService.saveBreakevenConfig({ fixedCosts, avgCupPrice: avgPrice, variableRatio: varRatio });

    // Update Slider Labels
    const valFixed = document.getElementById('valFixedCosts');
    const valPrice = document.getElementById('valAvgCupPrice');
    const valRatio = document.getElementById('valVariableRatio');
    if (valFixed) valFixed.textContent = `${fixedCosts.toLocaleString('en-US')} ر.س`;
    if (valPrice) valPrice.textContent = `${avgPrice} ر.س`;
    if (valRatio) valRatio.textContent = `${Math.round(varRatio * 100)}%`;

    // Calculations
    const monthlyBreakeven = Math.round(fixedCosts / contribMargin);
    const dailyBreakeven = Math.round(monthlyBreakeven / 30);
    const dailyCups = Math.round(dailyBreakeven / avgPrice);
    const cupMarginSAR = (avgPrice * contribMargin).toFixed(2);

    // Update Metric Cards
    const elMargin = document.getElementById('calcContribMargin');
    const elContribSAR = document.getElementById('calcContribSAR');
    const elMonth = document.getElementById('calcMonthlyBreakeven');
    const elDay = document.getElementById('calcDailyBreakeven');
    const elCups = document.getElementById('calcDailyCups');

    if (elMargin) elMargin.textContent = `${Math.round(contribMargin * 100)}%`;
    if (elContribSAR) elContribSAR.textContent = `هامش الكوب الصافي: ${cupMarginSAR} ر.س`;
    if (elMonth) elMonth.textContent = `${monthlyBreakeven.toLocaleString('en-US')} ر.س`;
    if (elDay) elDay.textContent = `${dailyBreakeven.toLocaleString('en-US')} ر.س`;
    if (elCups) elCups.textContent = `${dailyCups} كوب`;

    // Scenarios Table
    const targets = [
        { label: 'التعادل (صفر ربح)', profit: 0, tag: 'سقف الأمان', badge: 'badge-blue' },
        { label: 'صافي ربح 10,000 ر.س', profit: 10000, tag: 'هدف أولي', badge: 'badge-green' },
        { label: 'صافي ربح 20,000 ر.س', profit: 20000, tag: 'هدف توسعي', badge: 'badge-green' },
        { label: 'صافي ربح 30,000 ر.س', profit: 30000, tag: 'الريادة الميدانية', badge: 'badge-oxford' }
    ];

    const tbody = document.getElementById('profitTargetTableBody');
    if (tbody) {
        tbody.innerHTML = targets.map(t => {
            const reqMonthly = Math.round((fixedCosts + t.profit) / contribMargin);
            const reqDaily = Math.round(reqMonthly / 30);
            const reqCups = Math.round(reqDaily / avgPrice);
            return `
                <tr>
                    <td style="font-weight:700;color:#0F172A;">${t.label}</td>
                    <td style="font-weight:800;color:#0284C7;">${reqMonthly.toLocaleString('en-US')} ر.س</td>
                    <td style="font-weight:700;">${reqDaily.toLocaleString('en-US')} ر.س</td>
                    <td style="font-weight:700;">${reqCups} كوب / يوم</td>
                    <td><span class="badge ${t.badge}">${t.tag}</span></td>
                </tr>
            `;
        }).join('');
    }
};

// ===================================================================
// 7. RACI RESPONSIBILITY MATRIX (GOVERNANCE ALIGNED)
// ===================================================================
function getRACIMatrixContent() {
    // Columns: Alaa (CSA & Roastmaster), Abdullah (COO), Joud (CEO & CMO), Anas (CFO), Aref (Morning Barista), Elem (Evening Barista)
    // Aref & Elem are strictly operational baristas (Zero administrative tasks)
    const matrix = [
        { task:'تشغيل الحماصة الرائدة وضبط البروفايلات', alaa:'R, A', abdullah:'C',    joud:'I',   anas:'I',   aref:'C',    elem:'-' },
        { task:'جلسات Cupping وتقييم جودة حبوب البن',     alaa:'R, A', abdullah:'C',    joud:'I',   anas:'I',   aref:'C',    elem:'C' },
        { task:'إدارة العمليات الميدانية وانضباط الشفتات', alaa:'C',    abdullah:'R, A', joud:'I',   anas:'I',   aref:'R',    elem:'R' },
        { task:'سلاسل الإمداد ومخزون الحليب والأكواب',     alaa:'C',    abdullah:'R, A', joud:'I',   anas:'C',   aref:'I',    elem:'I' },
        { task:'صيانة ماكينة الإسبريسو والمطاحن والمعدات', alaa:'C',    abdullah:'R, A', joud:'I',   anas:'I',   aref:'C',    elem:'C' },
        { task:'مبيعات الجملة B2B والتفاوض مع المقاهي',    alaa:'C',    abdullah:'C',    joud:'R, A',anas:'I',   aref:'-',    elem:'-' },
        { task:'التسويق الرقمي والهوية وحملات السوشيال',   alaa:'C',    abdullah:'I',    joud:'R, A',anas:'I',   aref:'-',    elem:'-' },
        { task:'الإدارة المالية، الفوترة، ومطابقة البنوك', alaa:'I',    abdullah:'I',    joud:'I',   anas:'R, A',aref:'-',    elem:'-' },
        { task:'مراقبة التدفق النقدي ونموذج نقطة التعادل', alaa:'C',    abdullah:'I',    joud:'C',   anas:'R, A',aref:'-',    elem:'-' },
        { task:'تحضير المشروبات وخدمة الزوار بالبار',      alaa:'C',    abdullah:'A',    joud:'I',   anas:'-',   aref:'R',    elem:'R' }
    ];

    function badge(val) {
        if (val === '-') return '<span style="color:var(--border-muted)">—</span>';
        const cls = val.includes('A') ? 'badge-green' : val.includes('R') ? 'badge-blue' : val.includes('C') ? 'badge-warning' : 'badge-subtle';
        return `<span class="badge ${cls}">${val}</span>`;
    }

    return `
        <div class="page-header">
            <h2 class="page-title">مصفوفة المسؤوليات وحوكمة القرارات (RACI Matrix)</h2>
            <p class="page-subtitle">تحديد دقيق للمسؤوليات بين الشركاء المؤسسين الأربعة وكادر البار الميداني لضمان انعدام تضارب الصلاحيات</p>
        </div>

        <div class="alert info" style="margin-bottom:1.5rem;">
            <i class="fas fa-shield-halved"></i>
            <div>
                <strong>دليل الرموز:</strong>
                <strong>R</strong> = المنفذ المباشر (Responsible) &nbsp;|&nbsp;
                <strong>A</strong> = صاحب القرار والمساءلة النهائية (Accountable) &nbsp;|&nbsp;
                <strong>C</strong> = المستشار الفني (Consulted) &nbsp;|&nbsp;
                <strong>I</strong> = المطلع على النتائج (Informed) &nbsp;|&nbsp;
                <strong>ملاحظة حوكمة:</strong> كادر البار (عارف وعلم) محددون حصراً كباريستا تنفيذيين دون مهام إدارية.
            </div>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">مصفوفة الصلاحيات المعتمدة لـ RoR</h3></div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th style="min-width:220px">المجال التشغيلي</th>
                            <th>علاء يوسف (CSA)</th>
                            <th>عبد الله القصير (COO)</th>
                            <th>جود القصير (CEO & CMO)</th>
                            <th>أنس الصفدي (CFO)</th>
                            <th>عارف (باريستا صباحي)</th>
                            <th>علم (باريستا مسائي)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${matrix.map(r => `
                            <tr>
                                <td><strong>${r.task}</strong></td>
                                <td>${badge(r.alaa)}</td>
                                <td>${badge(r.abdullah)}</td>
                                <td>${badge(r.joud)}</td>
                                <td>${badge(r.anas)}</td>
                                <td>${badge(r.aref)}</td>
                                <td>${badge(r.elem)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ===================================================================
// 8. WASTE & CASHFLOW TRACKING (WITH DAILY GUARDRAIL)
// ===================================================================
function getWasteCashflowContent() {
    const wasteLogs = window.DataService.getWasteLogs();

    // Calculate today's waste (dynamic date)
    const _todayD = new Date();
    const todayStr = `${_todayD.getFullYear()}-${String(_todayD.getMonth()+1).padStart(2,'0')}-${String(_todayD.getDate()).padStart(2,'0')}`;
    const todayWaste = wasteLogs.filter(w => w.date === todayStr).reduce((sum, w) => sum + (parseFloat(w.costSAR) || 0), 0);
    const totalWasteWeek = wasteLogs.reduce((sum, w) => sum + (parseFloat(w.costSAR) || 0), 0);
    const isExceedThreshold = todayWaste > 100.0;

    return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
                <h2 class="page-title">إدارة مكافحة الهدر والسيولة النقدية</h2>
                <p class="page-subtitle">تتبع تفصيلي لهدر البن والحليب والمستهلكات مع تطبيق نظام الإنذار المبكر لحماية الأرباح</p>
            </div>
            <div style="display:flex;gap:8px;">
                <button type="button" class="btn btn-primary" onclick="openWasteLogModal()" style="background:#DC2626;border-color:#DC2626;">
                    <i class="fas fa-trash-can"></i> تسجيل واقعة هدر
                </button>
            </div>
        </div>

        ${isExceedThreshold ? `
            <div class="alert danger" style="margin-bottom:1.5rem;animation:fadeIn 0.3s ease;">
                <i class="fas fa-triangle-exclamation"></i>
                <div>
                    <strong>إنذار مالي حرج:</strong> تجاوز إجمالي هدر اليوم الحد اليومي المسموح به (${todayWaste.toFixed(2)} ر.س > 100.00 ر.س). يرجى التحقق الفوري من معايرة الطاحونة وتبخير الحليب.
                </div>
            </div>
        ` : ''}

        <!-- Waste Summary KPI Cards -->
        <div class="stats-grid">
            <div class="stat-card danger">
                <div class="stat-header"><span class="stat-title">هدر اليوم الميداني</span><div class="stat-icon danger"><i class="fas fa-trash-can"></i></div></div>
                <div class="stat-value">${todayWaste.toFixed(2)} ر.س</div>
                <div class="stat-change ${isExceedThreshold ? 'negative' : 'positive'}">
                    <span>${isExceedThreshold ? 'تجاوز سقف 100 ر.س' : 'ضمن النطاق الآمن (<100 ر.س)'}</span>
                </div>
            </div>

            <div class="stat-card warning">
                <div class="stat-header"><span class="stat-title">إجمالي هدر الأسبوع</span><div class="stat-icon warning"><i class="fas fa-coins"></i></div></div>
                <div class="stat-value">${totalWasteWeek.toFixed(2)} ر.س</div>
                <div class="stat-change"><span>مجموع كافة العمليات المسجلة</span></div>
            </div>

            <div class="stat-card primary">
                <div class="stat-header"><span class="stat-title">نسبة الهدر من المبيعات</span><div class="stat-icon primary"><i class="fas fa-percent"></i></div></div>
                <div class="stat-value">1.8%</div>
                <div class="stat-change positive"><span>الحد المعياري العالمي < 2.5%</span></div>
            </div>

            <div class="stat-card success">
                <div class="stat-header"><span class="stat-title">صافي التدفق الإيجابي</span><div class="stat-icon success"><i class="fas fa-money-bill-wave"></i></div></div>
                <div class="stat-value">+24,800 ر.س</div>
                <div class="stat-change positive"><span>سيولة نقدية ممتازة</span></div>
            </div>
        </div>

        <!-- Waste Logs Table -->
        <div class="table-card">
            <div class="table-header">
                <div>
                    <h3 class="table-title">سجل الهدر الميداني المفصل</h3>
                    <p style="margin:4px 0 0 0;font-size:0.8rem;color:#64748B;">بيانات مسجلة بواسطة كادر البار والمحمصة لضبط الاستهلاك</p>
                </div>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>التاريخ</th>
                            <th>المادة / الصنف</th>
                            <th>الكمية</th>
                            <th>التكلفة (ر.س)</th>
                            <th>الوردية</th>
                            <th>المسؤول</th>
                            <th>سبب الهدر</th>
                            <th style="width:70px;">حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${wasteLogs.map(w => `
                            <tr>
                                <td style="font-weight:700;color:#0F172A;">${w.date}</td>
                                <td style="font-weight:600;">${w.item}</td>
                                <td>${w.quantity} ${w.unit}</td>
                                <td style="font-weight:800;color:#DC2626;">-${parseFloat(w.costSAR).toFixed(2)} ر.س</td>
                                <td><span class="badge ${w.shift === 'morning' ? 'badge-blue' : 'badge-oxford'}">${w.shift === 'morning' ? 'صباحي' : 'مسائي'}</span></td>
                                <td><strong style="color:#0284C7;"><i class="fas fa-user-circle" style="margin-left:4px;"></i>${w.reportedBy}</strong></td>
                                <td style="font-size:0.82rem;color:#64748B;">${w.reason}</td>
                                <td>
                                    <button type="button" class="btn btn-outline" onclick="window.DataService.deleteWasteLog(${w.id}); loadPage('waste-cashflow');" style="padding:4px 8px;font-size:0.75rem;color:#DC2626;" title="حذف السجل">
                                        <i class="fas fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ===================================================================
// 9. CAFÉ BAR SALES & SHIFTS (AREF & ELEM)
// ===================================================================


function getFinancialCommitmentsContent() {
    const commitments = window.DataService.getFinancials();

    return `
        <div class="page-header">
            <h2 class="page-title">حصر الالتزامات والمصاريف المالية المجدولة</h2>
            <p class="page-subtitle">جدولة المصاريف التشغيلية الثابتة والالتزامات التعاقدية لضمان سلامة التدفق النقدي</p>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 class="table-title">قائمة الالتزامات المالية</h3></div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>البند / الالتزام</th>
                            <th>المبلغ</th>
                            <th>تاريخ الاستحقاق</th>
                            <th>طريقة الدفع</th>
                            <th>النوع</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${commitments.map(c => `
                            <tr>
                                <td style="font-weight:700;color:#0F172A;">${c.title}</td>
                                <td style="font-weight:800;color:#DC2626;">${parseFloat(c.amount).toLocaleString('en-US')} ر.س</td>
                                <td>${c.dueDate}</td>
                                <td>${c.paymentMethod}</td>
                                <td><span class="badge ${c.type === 'fixed' ? 'badge-oxford' : 'badge-subtle'}">${c.type === 'fixed' ? 'ثابت' : 'متغير'}</span></td>
                                <td><span class="badge ${c.status === 'paid' ? 'badge-green' : 'badge-warning'}">${c.status === 'paid' ? 'مدفوع' : 'مستحق قريباً'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ===================================================================
// 12. VISION DASHBOARD & REVOLUTION PLAN
// ===================================================================
function getVisionDashboardContent() {
    return `
        <div class="page-header">
            <h2 class="page-title">الرؤية الانتقالية ولوحة الأداء المالي</h2>
            <p class="page-subtitle">ملخص شامل للأداء التشغيلي والمالي والهوامش الربحية المستهدفة</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header"><span class="stat-title">إجمالي الإيرادات (شهري)</span><div class="stat-icon primary"><i class="fas fa-chart-line"></i></div></div>
                <div class="stat-value">80,000 ر.س</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>18% نمو شهري</span></div>
            </div>
            <div class="stat-card success">
                <div class="stat-header"><span class="stat-title">مبيعات البار</span><div class="stat-icon success"><i class="fas fa-coffee"></i></div></div>
                <div class="stat-value">48,000 ر.س</div>
                <div class="stat-change"><span>60% من الإجمالي</span></div>
            </div>
            <div class="stat-card warning">
                <div class="stat-header"><span class="stat-title">مبيعات المحمصة (الحماصة الرائدة)</span><div class="stat-icon warning"><i class="fas fa-fire"></i></div></div>
                <div class="stat-value">32,000 ر.س</div>
                <div class="stat-change"><span>40% من الإجمالي</span></div>
            </div>
            <div class="stat-card danger">
                <div class="stat-header"><span class="stat-title">إجمالي المصاريف التشغيلية</span><div class="stat-icon danger"><i class="fas fa-receipt"></i></div></div>
                <div class="stat-value">55,200 ر.س</div>
                <div class="stat-change"><span>69% من الإيرادات</span></div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title">الإيرادات الشهرية المقارنة</h3></div>
                <div class="chart-container"><canvas id="monthlyRevenueChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title">توزيع المصروفات التشغيلية</h3></div>
                <div class="chart-container"><canvas id="productDistChart"></canvas></div>
            </div>
        </div>
    `;
}

function getRevolutionPlanContent() {
    const phases = [
        { date: 'الأسبوع 1-2 | مرحلة التأسيس والاستقرار', title: 'إطلاق نظام RoR التشغيلي الموحد وتثبيت مصفوفة RACI', items: ['إطلاق نظام الإدارة الموحد', 'تثبيت هوامش الربحية', 'تدريب باريستا البار على المعايرة', 'حصر الأصول الثابتة'] },
        { date: 'الأسبوع 3-4 | مرحلة تحسين الهوامش', title: 'تطبيق هندسة القائمة وإزالة الأصناف المنخفضة (Dogs)', items: ['تنقية المنيو بناءً على المصفوفة الثنائية', 'استهداف 3 مقاهٍ جديدة لتوريد الجملة', 'تفعيل نموذج نقاط التعادل اليومي'] },
        { date: 'الأسبوع 5-6 | مرحلة التوسع الميداني', title: 'تنشيط المتجر الإلكتروني وزيادة نقاط البيع', items: ['ربط المتجر الإلكتروني بالمخزون', 'تسكين شواغر التوسع الوظيفي', 'التفاوض مع موردي البن الأخضر للكميات'] },
        { date: 'الأسبوع 7-8 | مرحلة التعزيز والريادة', title: 'اعتماد أدلة التشغيل القياسية SOPs وخطة التوسع', items: ['تسليم أدلة التشغيل للمدراء', 'تطوير خط إنتاج قهوة باردة معلبة RTD', 'اعتماد خطة افتتاح الفرع الثاني'] }
    ];

    return `
        <div class="page-header">
            <h2 class="page-title">خطة ثورة RoR التنفيذية</h2>
            <p class="page-subtitle">خارطة طريق التحول المؤسسي من الوضع الراهن إلى الريادة الإقليمية</p>
        </div>

        <div class="timeline" style="margin-top:1.5rem;">
            ${phases.map(p => `
                <div class="timeline-item" style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:1.25rem;margin-bottom:1rem;border-right:4px solid #0284C7;">
                    <div style="font-weight:700;color:#0284C7;font-size:0.85rem;margin-bottom:0.35rem;">${p.date}</div>
                    <h3 style="font-size:1.05rem;color:#0F172A;margin-bottom:0.6rem;">${p.title}</h3>
                    <ul style="padding-right:1.25rem;color:#64748B;font-size:0.85rem;line-height:1.6;">
                        ${p.items.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    `;
}



// ===================================================================
// 14. DEVELOPMENT & GROWTH (TRAINING, SOPS, ROADMAP, INNOVATION)
// ===================================================================
function getDevelopmentContent() {
    const devItems = window.DataService.getDevPipeline();

    const trainingItems = devItems.filter(d => d.category === 'training');
    const sopItems = devItems.filter(d => d.category === 'sop');
    const autoItems = devItems.filter(d => d.category === 'automation');
    const innovItems = devItems.filter(d => d.category === 'innovation');

    return `
        <div class="page-header">
            <h2 class="page-title">التطوير المؤسسي ومسارات النمو</h2>
            <p class="page-subtitle">برامج التدريب، أدلة التشغيل القياسية (SOPs)، خارطة الأتمتة، ومشاريع الابتكار</p>
        </div>

        <!-- 4 Pillars Grid -->
        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header"><span class="stat-title">مسارات التدريب والتأهيل</span><div class="stat-icon primary"><i class="fas fa-graduation-cap"></i></div></div>
                <div class="stat-value">${trainingItems.length} برامج</div>
                <div class="stat-change"><span>تطوير مهارات الباريستا والتحميص</span></div>
            </div>
            <div class="stat-card success">
                <div class="stat-header"><span class="stat-title">أدلة التشغيل القياسية (SOP)</span><div class="stat-icon success"><i class="fas fa-book"></i></div></div>
                <div class="stat-value">${sopItems.length} أدلة</div>
                <div class="stat-change"><span>توثيق إجراءات العمل وضبط الجودة</span></div>
            </div>
            <div class="stat-card warning">
                <div class="stat-header"><span class="stat-title">خارطة التحول والأتمتة</span><div class="stat-icon warning"><i class="fas fa-robot"></i></div></div>
                <div class="stat-value">${autoItems.length} مبادرات</div>
                <div class="stat-change"><span>ربط المخزون، POS، والفوترة</span></div>
            </div>
            <div class="stat-card info">
                <div class="stat-header"><span class="stat-title">مشاريع الابتكار والمنتجات</span><div class="stat-icon primary"><i class="fas fa-lightbulb"></i></div></div>
                <div class="stat-value">${innovItems.length} مشاريع</div>
                <div class="stat-change"><span>خط القهوة المعلبة RTD والتخمير</span></div>
            </div>
        </div>

        <!-- Initiatives List -->
        <div class="table-card" style="margin-top:1.5rem;">
            <div class="table-header">
                <h3 class="table-title">مصفوفة مبادرات التطوير والنمو المعتمدة</h3>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>المسار</th>
                            <th>المبادرة / المشروع</th>
                            <th>التفاصيل التشغيلية</th>
                            <th>المسؤول</th>
                            <th>تاريخ الإنجاز</th>
                            <th style="width:160px;">نسبة التقدم</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${devItems.map(d => `
                            <tr>
                                <td>
                                    <span class="badge ${d.category === 'training' ? 'badge-blue' : d.category === 'sop' ? 'badge-green' : d.category === 'automation' ? 'badge-warning' : 'badge-oxford'}">
                                        ${d.category === 'training' ? 'تدريب' : d.category === 'sop' ? 'SOP تشغيل' : d.category === 'automation' ? 'أتمتة' : 'ابتكار'}
                                    </span>
                                </td>
                                <td style="font-weight:700;color:#0F172A;">${d.title}</td>
                                <td style="font-size:0.82rem;color:#64748B;">${d.description}</td>
                                <td><strong style="color:#0284C7;">${d.owner}</strong></td>
                                <td>${d.targetDate}</td>
                                <td>
                                    <div class="progress-container" style="margin:0;">
                                        <div class="progress-label" style="font-size:0.75rem;"><span>${d.progressPct}%</span></div>
                                        <div class="progress-bar-bg" style="height:6px;">
                                            <div class="progress-bar-fill" style="width:${d.progressPct}%;background:#0284C7;"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}



// ===================================================================
// OPERATIONAL MODAL HANDLERS & CRUD
// ===================================================================
// Waste Log Modal Handlers
window.openWasteLogModal = function() {
    const modal = document.getElementById('wasteLogModal');
    if (modal) modal.classList.add('active');
};
window.closeWasteLogModal = function() {
    const modal = document.getElementById('wasteLogModal');
    if (modal) modal.classList.remove('active');
};
window.saveWasteLog = function(e) {
    e.preventDefault();
    const date = document.getElementById('wasteDate').value;
    const category = document.getElementById('wasteCategory').value;
    const item = document.getElementById('wasteItem').value;
    const quantity = parseFloat(document.getElementById('wasteQuantity').value) || 0;
    const unit = document.getElementById('wasteUnit').value;
    const costSAR = parseFloat(document.getElementById('wasteCostSAR').value) || 0;
    const shift = document.getElementById('wasteShift').value;
    const reportedBy = document.getElementById('wasteReportedBy').value;
    const reason = document.getElementById('wasteReason').value;

    window.DataService.addWasteLog({
        date, category, item, quantity, unit, costSAR, shift, reportedBy, reason
    });
    closeWasteLogModal();
    loadPage(window.currentPage);
};

// Menu Item Modal Handlers
window.openMenuItemModal = function() {
    const modal = document.getElementById('menuItemModal');
    if (modal) modal.classList.add('active');
};
window.closeMenuItemModal = function() {
    const modal = document.getElementById('menuItemModal');
    if (modal) modal.classList.remove('active');
};
window.saveMenuItem = function(e) {
    e.preventDefault();
    const name = document.getElementById('menuItemName').value;
    const category = document.getElementById('menuItemCategory').value;
    const popularity = parseInt(document.getElementById('menuItemPopularity').value) || 7;
    const price = parseFloat(document.getElementById('menuItemPrice').value) || 0;
    const cost = parseFloat(document.getElementById('menuItemCost').value) || 0;

    window.DataService.saveMenuItem({ name, category, popularity, price, cost });
    closeMenuItemModal();
    loadPage(window.currentPage);
};

// Department Task Modal Handlers
window.saveDeptTask = function(e) {
    e.preventDefault();
    const deptKey = document.getElementById('deptTaskDeptKey').value;
    const title = document.getElementById('deptTaskTitle').value;
    const assignedTo = document.getElementById('deptTaskAssignedTo').value;
    const priority = document.getElementById('deptTaskPriority').value;
    const dueDate = document.getElementById('deptTaskDueDate').value;

    window.DataService.addDeptTask({ deptKey, title, assignedTo, priority, dueDate });
    if (typeof closeDeptTaskModal === 'function') closeDeptTaskModal();
    loadPage(window.currentPage);
};



// Attach operational functions to window
window.getDashboardContent = getDashboardContent;
window.getKPIDashboardContent = getKPIDashboardContent;
window.getWeeklyPlanContent = getWeeklyPlanContent;
window.get40TasksContent = get40TasksContent;
window.getMenuEngineeringContent = getMenuEngineeringContent;
window.getBreakevenContent = getBreakevenContent;
window.getRACIMatrixContent = getRACIMatrixContent;
window.getWasteCashflowContent = getWasteCashflowContent;
window.getFinancialCommitmentsContent = getFinancialCommitmentsContent;
window.getVisionDashboardContent = getVisionDashboardContent;
window.getRevolutionPlanContent = getRevolutionPlanContent;
window.getDevelopmentContent = getDevelopmentContent;
