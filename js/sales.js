/**
 * RoR Enterprise Suite - Sales, Roastery Production & Governance
 * System Version: 2.4.0-MODULAR
 * Modules: Café Shifts (Aref/Elem), Roastery Batches & B2B, Org Structure & Vacancy Management
 */

function getCafeSalesContent() {
    const shiftReports = window.DataService.getCafeSales();

    const morningSales = shiftReports.filter(s => s.barista === 'عارف').reduce((sum, s) => sum + (parseFloat(s.revenue) || 0), 0);
    const eveningSales = shiftReports.filter(s => s.barista === 'علم').reduce((sum, s) => sum + (parseFloat(s.revenue) || 0), 0);
    const totalRev = morningSales + eveningSales;
    const totalCups = shiftReports.reduce((sum, s) => sum + (parseInt(s.cups) || 0), 0);

    return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
                <h2 class="page-title">تقارير مبيعات البار والورديات (وردية عارف وعلم)</h2>
                <p class="page-subtitle">تتبع تفصيلي لأداء شفتات البار: الوردية الصباحية (عارف 8:00 - 16:00) والوردية المسائية (علم 16:00 - 00:00)</p>
            </div>
            <div style="display:flex;gap:8px;">
                <button type="button" class="btn btn-primary" onclick="openCafeShiftModal()"><i class="fas fa-plus"></i> تسجيل تقرير وردية</button>
            </div>
        </div>

        <!-- Stat Summary Grid -->
        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header"><span class="stat-title">إجمالي مبيعات البار المسجلة</span><div class="stat-icon primary"><i class="fas fa-cash-register"></i></div></div>
                <div class="stat-value">${totalRev.toLocaleString('en-US')} ر.س</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>مجموع كافة الورديات</span></div>
            </div>

            <div class="stat-card success">
                <div class="stat-header"><span class="stat-title">الوردية الصباحية (عارف)</span><div class="stat-icon success"><i class="fas fa-sun"></i></div></div>
                <div class="stat-value">${morningSales.toLocaleString('en-US')} ر.س</div>
                <div class="stat-change"><span>إقبال عالي على V60 وقهوة اليوم</span></div>
            </div>

            <div class="stat-card warning">
                <div class="stat-header"><span class="stat-title">الوردية المسائية (علم)</span><div class="stat-icon warning"><i class="fas fa-moon"></i></div></div>
                <div class="stat-value">${eveningSales.toLocaleString('en-US')} ر.س</div>
                <div class="stat-change"><span>ذروة مسائية وطلبات المشروبات الباردة</span></div>
            </div>

            <div class="stat-card info">
                <div class="stat-header"><span class="stat-title">إجمالي الأكواب المباعة</span><div class="stat-icon primary"><i class="fas fa-mug-hot"></i></div></div>
                <div class="stat-value">${totalCups} كوب</div>
                <div class="stat-change positive"><span>معدل تدفق 18 كوب / ساعة ذروة</span></div>
            </div>
        </div>

        <!-- Shift Charts Grid -->
        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title"><i class="fas fa-chart-column" style="color:#0284C7;margin-left:6px;"></i> مقارنة مبيعات الشفتات (عارف vs علم)</h3></div>
                <div class="chart-container"><canvas id="shiftComparisonChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title"><i class="fas fa-chart-pie" style="color:#10B981;margin-left:6px;"></i> المشروبات الأكثر طلباً في البار</h3></div>
                <div class="chart-container"><canvas id="topProductsChart"></canvas></div>
            </div>
        </div>

        <!-- Shift Breakdown Table -->
        <div class="table-card">
            <div class="table-header">
                <div>
                    <h3 class="table-title">سجل ورديات مبيعات البار اليومية التفصيلي</h3>
                    <p style="margin:4px 0 0 0;font-size:0.8rem;color:#64748B;">بيانات مطابقة لنظام نقاط البيع POS</p>
                </div>
            </div>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>التاريخ</th>
                            <th>الوردية / الشفت</th>
                            <th>الباريستا المسؤول</th>
                            <th>الأكواب</th>
                            <th>الحلويات</th>
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
                                    <td style="font-weight:800;color:#10B981;">${parseFloat(s.revenue).toLocaleString('en-US')} ر.س</td>
                                    <td>${s.tickets}</td>
                                    <td style="font-weight:700;color:#0F172A;">${parseFloat(s.avgTicket).toFixed(1)} ر.س</td>
                                    <td style="font-size:0.8rem;color:#64748B;">${s.notes || '—'}</td>
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
// 10. ROASTERY SALES & PRODUCTION (PRIMARY ROASTER)
// ===================================================================
function getRoasterySalesContent() {
    const roastSales = window.DataService.getRoasterySales();

    const totalKg = roastSales.reduce((sum, r) => sum + (parseFloat(r.roastedKg) || 0), 0);
    const totalRevenue = roastSales.reduce((sum, r) => sum + (parseFloat(r.paid) || 0), 0);
    const wholesaleKg = roastSales.filter(r => r.type === 'wholesale').reduce((sum, r) => sum + (parseFloat(r.roastedKg) || 0), 0);
    const retailKg = roastSales.filter(r => r.type === 'retail').reduce((sum, r) => sum + (parseFloat(r.roastedKg) || 0), 0);

    return `
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
                <h2 class="page-title">تقارير إنتاج ومبيعات المحمصة (الحماصة الرائدة)</h2>
                <p class="page-subtitle">إدارة مبيعات الجملة B2B وتوزيع أرباع البن (250جم) لرف الفرع والمتجر الإلكتروني عبر "الحماصة الرائدة"</p>
            </div>
            <div style="display:flex;gap:8px;">
                <button type="button" class="btn btn-primary" onclick="openRoasteryBatchModal()"><i class="fas fa-plus"></i> تسجيل دفعة تحميص</button>
            </div>
        </div>

        <!-- KPI Stat Grid -->
        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-header"><span class="stat-title">إجمالي إيراد التحميص</span><div class="stat-icon primary"><i class="fas fa-fire-burner"></i></div></div>
                <div class="stat-value">${totalRevenue.toLocaleString('en-US')} ر.س</div>
                <div class="stat-change positive"><i class="fas fa-arrow-up"></i> <span>الحماصة الرائدة</span></div>
            </div>

            <div class="stat-card success">
                <div class="stat-header"><span class="stat-title">إجمالي البن المحمص</span><div class="stat-icon success"><i class="fas fa-weight-hanging"></i></div></div>
                <div class="stat-value">${totalKg} كجم</div>
                <div class="stat-change positive"><span>معدل فقد وزن مثالي (<14.5%)</span></div>
            </div>

            <div class="stat-card warning">
                <div class="stat-header"><span class="stat-title">عقود الجملة B2B</span><div class="stat-icon warning"><i class="fas fa-handshake"></i></div></div>
                <div class="stat-value">${wholesaleKg} كجم</div>
                <div class="stat-change"><span>عقود توريد شهرية مستمرة</span></div>
            </div>

            <div class="stat-card info">
                <div class="stat-header"><span class="stat-title">مبيعات أرباع (250جم)</span><div class="stat-icon primary"><i class="fas fa-bag-shopping"></i></div></div>
                <div class="stat-value">${Math.round(retailKg * 4)} كيس</div>
                <div class="stat-change"><span>${retailKg} كجم للرف والمتجر الإلكتروني</span></div>
            </div>
        </div>

        <!-- Roastery Charts -->
        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title"><i class="fas fa-chart-pie" style="color:#0284C7;margin-left:6px;"></i> توزيع قنوات تصريف التحميص</h3></div>
                <div class="chart-container"><canvas id="salesChannelsChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-header"><h3 class="chart-title"><i class="fas fa-chart-line" style="color:#10B981;margin-left:6px;"></i> مسار نمو إنتاج الحماصة الرائدة</h3></div>
                <div class="chart-container"><canvas id="roasteryTrendChart"></canvas></div>
            </div>
        </div>

        <!-- Roastery Sales Records -->
        <div class="table-card">
            <div class="table-header">
                <div>
                    <h3 class="table-title">سجل صفقات وتوريد حبوب القهوة المحمصة</h3>
                    <p style="margin:4px 0 0 0;font-size:0.8rem;color:#64748B;">بيانات التوريد المعتمدة لعملاء الجملة والتجزئة عبر الحماصة الرائدة</p>
                </div>
            </div>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>التاريخ</th>
                            <th>العميل / القناة</th>
                            <th>نوع الطلبية</th>
                            <th>البن الأخضر</th>
                            <th>البن المحمص</th>
                            <th>نسبة الفقد (Loss %)</th>
                            <th>سعر الكيلو</th>
                            <th>المبلغ الإجمالي</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${roastSales.map(r => {
                            const isWholesale = r.type === 'wholesale';
                            const lossPct = parseFloat(r.roastLossPct) || 14.0;
                            const isLossWarning = lossPct > 18.0;
                            return `
                                <tr>
                                    <td style="font-weight:700;color:#0F172A;">${r.date}</td>
                                    <td style="font-weight:600;"><i class="fas ${isWholesale ? 'fa-store' : 'fa-bag-shopping'}" style="color:#0284C7;margin-left:6px;"></i>${r.client}</td>
                                    <td><span class="badge ${isWholesale ? 'badge-oxford' : 'badge-blue'}">${isWholesale ? 'جملة B2B' : 'أرباع تجزئة 250جم'}</span></td>
                                    <td>${r.greenKg || '—'} كجم</td>
                                    <td style="font-weight:700;">${r.roastedKg} كجم</td>
                                    <td>
                                        <span class="guardrail-badge ${isLossWarning ? 'danger' : 'safe'}">
                                            ${lossPct}% ${isLossWarning ? '(حرج)' : '(طبيعي)'}
                                        </span>
                                    </td>
                                    <td>${r.pricePerKg} ر.س</td>
                                    <td style="font-weight:800;color:#10B981;">${parseFloat(r.paid).toLocaleString('en-US')} ر.س</td>
                                    <td><span class="badge badge-green"><i class="fas fa-check" style="margin-left:4px;"></i>${r.status || 'مكتمل'}</span></td>
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
// 11. FINANCIAL COMMITMENTS
// ===================================================================


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
    return window.DataService.getOrgStructure();
}

function saveOrgAssignedRoles(roles) {
    window.DataService.saveOrgStructure(roles);
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

// ===================================================================
// 13. TEAM ROLES & MIND MAP (ALIGNED WITH 4 PARTNERS & BARISTAS)
// ===================================================================
function getTeamRolesContent() {
    const team = [
        {
            name: 'علاء يوسف',
            initial: 'ع',
            position: 'Chief Strategic Advisor (CSA) & Lead Roastmaster',
            responsibilities: [
                'القيادة الاستراتيجية ومراقبة مصفوفة الحوكمة وضبط هوامش الربحية.',
                'تصميم وبرمجة منحنيات التحميص (Roast Profiles) للحماصة الرائدة.',
                'قيادة جلسات تقييم جودة القهوة المختصة والتذوق الحسي (SCA Cupping).',
                'تطوير الخلطات الحصرية وإدارة الشراكات المعرفية.'
            ]
        },
        {
            name: 'جود القصير',
            initial: 'ج',
            position: 'Chief Executive Officer & Chief Marketing Officer (CEO & CMO)',
            responsibilities: [
                'القيادة العامة وتنسيق الخطط التطويرية وإدارة العمل المؤسسي الشامل.',
                'إدارة مبيعات الجملة B2B وتوسيع قاعدة المقاهي والشركات الشريكة.',
                'قيادة الحملات التسويقية الرقمية وإدارة منصات السوشيال ميديا والهوية.',
                'تنشيط مبيعات الرف بالفرع والمتجر الإلكتروني وشراكات الضيافة.'
            ]
        },
        {
            name: 'عبد الله القصير',
            initial: 'ع',
            position: 'Chief Operating Officer (COO)',
            responsibilities: [
                'الإشراف اليومي الميداني على انضباط ورديات البار ونظافة المعرض.',
                'إدارة سلاسل الإمداد ومستويات المخزون الحرج (Par Levels) ومكافحة الهدر.',
                'التنسيق اللوجستي اليومي بين إنتاج الحماصة الرائدة واحتياجات الفرع.',
                'متابعة الصيانة الدورية لمكائن الإسبريسو والمطاحن وأنظمة الفلاتر.'
            ]
        },
        {
            name: 'أنس الصفدي',
            initial: 'أ',
            position: 'Chief Financial Officer (CFO)',
            responsibilities: [
                'مراقبة السيولة النقدية اليومية وإدارة نموذج نقطة التعادل (Break-Even).',
                'إدارة سجلات المحاسبة، مسيرات الرواتب (Payroll)، والامتثال الضريبي ZATCA.',
                'جدولة التزامات الموردين وإدارة صندوق النثرية الميداني.',
                'إعداد القوائم المالية الشهرية (P&L) والتقارير التنفيذية للشركاء.'
            ]
        },
        {
            name: 'عارف',
            initial: 'عا',
            position: 'باريستا معتمد - الوردية الصباحية (08:00 - 16:00)',
            responsibilities: [
                'افتتاح البار الصباحي ومعايرة طواحين الإسبريسو والـ V60 بدقة.',
                'تحضير المشروبات وخدمة ضيوف الصباح وفق المعايير المعتمدة.',
                'تسجيل قراءات الاستخلاص والهدر الصباحي (التركيز الحصري على البار دون مهام إدارية).'
            ]
        },
        {
            name: 'علم',
            initial: 'عل',
            position: 'باريستا معتمد - الوردية المسائية (16:00 - 00:00)',
            responsibilities: [
                'إدارة فترات الذروة المسائية وتحضير المشروبات الساخنة والباردة.',
                'تسويق أصناف الحلويات ومبيعات أكياس البن المنزلي للزوار.',
                'إقفال البار اليومي، تنظيف وتعقيم المكائن والمطاحن وفق معايير HACCP.'
            ]
        }
    ];

    return `
        <div class="page-header">
            <h2 class="page-title">توصيف مهام فريق RoR المؤسسي</h2>
            <p class="page-subtitle">توزيع الأدوار التنفيذية بين الشركاء المؤسسين الأربعة وكادر البار الميداني المعتمد</p>
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
                        <h4>المهام والمسؤوليات المعتمدة</h4>
                        <ul>${m.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function getMindMapContent() {
    const branches = [
        { title: 'الحماصة الرائدة والإنتاج', items: ['بروفايلات التحميص', 'فحص الرطوبة والكثافة', 'جلسات Cupping', 'تعبئة أكياس الأرباع'] },
        { title: 'مبيعات الجملة B2B', items: ['عقود توريد المقاهي', 'عروض الأسعار المخصصة', 'عينات التذوق المجانية', 'شراكات المكاتب والشركات'] },
        { title: 'البار وتجربة الزائر', items: ['شفت عارف الصباحي', 'شفت علم المسائي', 'معايرة الإسبريسو والـ V60', 'مكافحة الهدر الميداني'] },
        { title: 'المالية والحوكمة', items: ['نموذج نقطة التعادل', 'الفوترة الإلكترونية ZATCA', 'مسيرات الرواتب', 'مطابقة البنوك ونقاط البيع'] },
        { title: 'التسويق والهوية', items: ['فيديوهات TikTok و Reels', 'تقييمات Google Maps', 'حملات المؤثرين Barter', 'بطاقات المحاصيل الفاخرة'] },
        { title: 'التطوير والتوسع', items: ['18 شاغراً مستهدفاً', 'خط القهوة المعلبة RTD', 'أدلة التشغيل القياسية SOP', 'دراسة الفرع الثاني'] }
    ];

    return `
        <div class="page-header">
            <h2 class="page-title">الخريطة الذهنية لمؤسسة RoR</h2>
            <p class="page-subtitle">رؤية شجرية مترابطة لكافة محاور العمليات وسلاسل القيمة</p>
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



// ===================================================================
// SALES & SHIFT MODAL HANDLERS
// ===================================================================
// Cafe Shift Modal Handlers
window.openCafeShiftModal = function() {
    const modal = document.getElementById('cafeShiftModal');
    if (modal) modal.classList.add('active');
};
window.closeCafeShiftModal = function() {
    const modal = document.getElementById('cafeShiftModal');
    if (modal) modal.classList.remove('active');
};
window.updateShiftBarista = function() {
    const type = document.getElementById('shiftType').value;
    const input = document.getElementById('shiftBarista');
    if (input) {
        input.value = (type === 'morning') ? 'عارف' : 'علم';
    }
};
window.saveCafeShift = function(e) {
    e.preventDefault();
    const date = document.getElementById('shiftDate').value;
    const type = document.getElementById('shiftType').value;
    const barista = document.getElementById('shiftBarista').value;
    const revenue = parseFloat(document.getElementById('shiftRevenue').value) || 0;
    const cups = parseInt(document.getElementById('shiftCups').value) || 0;
    const desserts = parseInt(document.getElementById('shiftDesserts').value) || 0;
    const tickets = parseInt(document.getElementById('shiftTickets').value) || 1;
    const notes = document.getElementById('shiftNotes').value;
    const shiftLabel = (type === 'morning') ? 'صباحي (عارف)' : 'مسائي (علم)';

    window.DataService.addCafeSale({
        date, shift: shiftLabel, barista, cups, desserts, revenue, tickets, avgTicket: (revenue/tickets), notes
    });
    closeCafeShiftModal();
    loadPage(window.currentPage);
};

// Roastery Batch Modal Handlers
window.openRoasteryBatchModal = function() {
    const modal = document.getElementById('roasteryBatchModal');
    if (modal) modal.classList.add('active');
};
window.closeRoasteryBatchModal = function() {
    const modal = document.getElementById('roasteryBatchModal');
    if (modal) modal.classList.remove('active');
};
window.calcRoastLoss = function() {
    const green = parseFloat(document.getElementById('roastGreenKg').value) || 0;
    const roasted = parseFloat(document.getElementById('roastRoastedKg').value) || 0;
    const textEl = document.getElementById('roastLossPctText');
    if (green > 0 && roasted > 0 && textEl) {
        const loss = (((green - roasted) / green) * 100).toFixed(1);
        const isWarning = parseFloat(loss) > 18.0;
        textEl.className = `guardrail-badge ${isWarning ? 'danger' : 'safe'}`;
        textEl.textContent = `${loss}% ${isWarning ? '(تحذير: تجاوز 18% فقد)' : '(نطاق مثالي)'}`;
    }
};
window.saveRoasteryBatch = function(e) {
    e.preventDefault();
    const date = document.getElementById('roastDate').value;
    const client = document.getElementById('roastClient').value;
    const roastProfile = document.getElementById('roastProfile').value;
    const type = document.getElementById('roastSaleType').value;
    const greenKg = parseFloat(document.getElementById('roastGreenKg').value) || 0;
    const roastedKg = parseFloat(document.getElementById('roastRoastedKg').value) || 0;
    const pricePerKg = parseFloat(document.getElementById('roastPricePerKg').value) || 0;
    const notes = document.getElementById('roastNotes').value;

    let lossPct = 14.0;
    if (greenKg > 0 && roastedKg > 0) {
        lossPct = parseFloat((((greenKg - roastedKg) / greenKg) * 100).toFixed(1));
    }
    const paid = roastedKg * pricePerKg;

    window.DataService.addRoasterySale({
        date, client, roastProfile, type, greenKg, roastedKg, roastLossPct: lossPct, pricePerKg, paid, pending: 0, status: 'مكتمل', notes
    });
    closeRoasteryBatchModal();
    loadPage(window.currentPage);
};



// Attach sales functions to window
window.getCafeSalesContent = getCafeSalesContent;
window.getRoasterySalesContent = getRoasterySalesContent;
window.getOrgChartContent = getOrgChartContent;
window.getTeamRolesContent = getTeamRolesContent;
window.getMindMapContent = getMindMapContent;
