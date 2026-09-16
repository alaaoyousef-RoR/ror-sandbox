/**
 * RoR Enterprise Suite - Core Application Engine & Data Controller
 * Version: 2.4.0-PROD
 * Architecture: SQLite REST API + Offline-First LocalStorage Synchronization
 */

// ====== GLOBAL APPLICATION STATE ======
window.currentPage = 'dashboard';
window.sidebarCollapsed = false;

// ====== PARTNER PROFILES (4 EQUAL EXECUTIVE FOUNDING PARTNERS) ======
const PARTNERS = {
    'alaa': {
        key: 'alaa',
        name: 'علاء يوسف',
        shortName: 'علاء',
        initials: 'ع ي',
        role: 'Chief Strategic Advisor (CSA) & Lead Roastmaster',
        shortRole: 'Chief Strategic Advisor'
    },
    'joud': {
        key: 'joud',
        name: 'جود القصير',
        shortName: 'جود',
        initials: 'ج ق',
        role: 'Chief Executive Officer & CMO (CEO & CMO)',
        shortRole: 'Chief Executive Officer'
    },
    'abdullah': {
        key: 'abdullah',
        name: 'عبد الله القصير',
        shortName: 'عبدالله',
        initials: 'ع ق',
        role: 'Chief Operating Officer (COO)',
        shortRole: 'Chief Operating Officer'
    },
    'anas': {
        key: 'anas',
        name: 'أنس الصفدي',
        shortName: 'أنس',
        initials: 'أ ص',
        role: 'Chief Financial Officer (CFO)',
        shortRole: 'Chief Financial Officer'
    }
};

// ===================================================================
// DATA SERVICE: OFFLINE-FIRST SYNCHRONIZATION WITH REST API & SQLITE
// ===================================================================
const API_BASE = window.location.port === '5001' ? '' : 'http://localhost:5001';

window.DataService = {
    // Helper: Async fetch with fallback
    async apiCall(endpoint, method = 'GET', body = null) {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };
            if (body && method !== 'GET') {
                options.body = JSON.stringify(body);
            }
            const res = await fetch(`${API_BASE}${endpoint}`, options);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            // Server offline or fetch failed; operates in offline-first mode
            return null;
        }
    },

    // 1. Tasks (40 Operational Blueprint)
    getTasks() {
        const local = localStorage.getItem('ror_tasks');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return this.getDefaultTasks();
    },
    saveTasks(tasks) {
        localStorage.setItem('ror_tasks', JSON.stringify(tasks));
        this.apiCall('/api/operations/tasks', 'POST', tasks);
    },
    updateTaskStatus(taskId, status) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = status;
            this.saveTasks(tasks);
            this.apiCall(`/api/operations/tasks/${taskId}`, 'PUT', { status });
            showToast(`تم تحديث حالة المهمة #${taskId} إلى "${status === 'completed' ? 'مكتمل' : status === 'in-progress' ? 'قيد التنفيذ' : 'مجدول'}"`, 'success');
        }
    },
    getDefaultTasks() {
        return [
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
    },

    // 2. Café Bar Shift Reports (Aref & Elem)
    getCafeSales() {
        const local = localStorage.getItem('ror_cafe_sales');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return [
            { id: 1, date: "2026-09-15", shift: "صباحي (عارف)", barista: "عارف", cups: 72, desserts: 14, revenue: 1320, tickets: 53, avgTicket: 24.9, notes: "إقبال ممتاز على قهوة اليوم والكرواسون" },
            { id: 2, date: "2026-09-14", shift: "مسائي (علم)", barista: "علم", cups: 92, desserts: 22, revenue: 1720, tickets: 64, avgTicket: 26.8, notes: "ذروة مسائية عالية ومبيعات كولد برو ممتازة" },
            { id: 3, date: "2026-09-14", shift: "صباحي (عارف)", barista: "عارف", cups: 65, desserts: 11, revenue: 1185, tickets: 48, avgTicket: 24.6, notes: "حركة منتظمة ومعايرة ممتازة للفلتر" },
            { id: 4, date: "2026-09-13", shift: "مسائي (علم)", barista: "علم", cups: 88, desserts: 19, revenue: 1590, tickets: 60, avgTicket: 26.5, notes: "طلب عالي على الحلى والمشروبات الباردة" },
            { id: 5, date: "2026-09-13", shift: "صباحي (عارف)", barista: "عارف", cups: 58, desserts: 9, revenue: 1040, tickets: 42, avgTicket: 24.7, notes: "فترة الصباح هادئة ومبيعات بن منزلي" }
        ];
    },
    addCafeSale(shift) {
        const list = this.getCafeSales();
        shift.id = Date.now();
        list.unshift(shift);
        localStorage.setItem('ror_cafe_sales', JSON.stringify(list));
        this.apiCall('/api/sales/cafe', 'POST', shift);
        showToast('تم تسجيل تقرير وردية البار بنجاح وحفظه في النظام', 'success');
    },

    // 3. Roastery Batches & B2B Invoices
    getRoasterySales() {
        const local = localStorage.getItem('ror_roast_sales');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return [
            { id: 1, date: "2026-09-15", client: "مقهى الأفق (حائل)", roastProfile: "بروفايل كولومبي", greenKg: 58, roastedKg: 50, roastLossPct: 13.8, pricePerKg: 75, type: "wholesale", paid: 3750, pending: 0, status: "مكتمل", notes: "تسليم مباشر عبر الحماصة الرائدة" },
            { id: 2, date: "2026-09-14", client: "مبيعات رف الفرع (أرباع 250جم)", roastProfile: "بروفايل شلشلي", greenKg: 29, roastedKg: 25, roastLossPct: 13.8, pricePerKg: 110, type: "retail", paid: 2750, pending: 0, status: "مكتمل", notes: "تغليف أكياس ربع للرف" },
            { id: 3, date: "2026-09-12", client: "سلسلة مقاهي نجد المختصة", roastProfile: "خلطة RoR", greenKg: 93, roastedKg: 80, roastLossPct: 14.0, pricePerKg: 82, type: "wholesale", paid: 6560, pending: 0, status: "مكتمل", notes: "عقد توريد شهري" },
            { id: 4, date: "2026-09-10", client: "متجر RoR الإلكتروني (أرباع 250جم)", roastProfile: "تارازو كوستاريكا", greenKg: 21, roastedKg: 18, roastLossPct: 14.3, pricePerKg: 95, type: "retail", paid: 1710, pending: 0, status: "مكتمل", notes: "طلبيات الشحن السريع" }
        ];
    },
    addRoasterySale(batch) {
        const list = this.getRoasterySales();
        batch.id = Date.now();
        list.unshift(batch);
        localStorage.setItem('ror_roast_sales', JSON.stringify(list));
        this.apiCall('/api/sales/roastery', 'POST', batch);
        if (batch.roastLossPct > 18.0) {
            showToast('تحذير: نسبة فقد وزن التحميص تجاوزت 18%!', 'warning');
        } else {
            showToast('تم تسجيل دفعة التحميص وفاتورة التوريد بنجاح', 'success');
        }
    },

    // 4. Waste Tracking
    getWasteLogs() {
        const local = localStorage.getItem('ror_waste');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return [
            { id: 1, date: "2026-09-15", category: "coffee", item: "بن مطحون (معايرة الصباح)", quantity: 0.45, unit: "كجم", costSAR: 45.0, reason: "معايرة طاحونة الإسبريسو بعد تنظيف الشفرات", reportedBy: "عارف", shift: "morning" },
            { id: 2, date: "2026-09-15", category: "milk", item: "حليب طازج نادك", quantity: 2.0, unit: "لتر", costSAR: 18.0, reason: "بقايا تبخير زائد وقت الذروة", reportedBy: "علم", shift: "evening" },
            { id: 3, date: "2026-09-14", category: "pastry", item: "كرواسون زعتر وجبن", quantity: 3.0, unit: "قطعة", costSAR: 24.0, reason: "انتهاء الصلاحية اليومية للعرض", reportedBy: "علم", shift: "evening" },
            { id: 4, date: "2026-09-13", category: "coffee", item: "حبوب محروقة (أول دفعة)", quantity: 0.5, unit: "كجم", costSAR: 35.0, reason: "ارتفاع حرارة الدرام المفاجئ", reportedBy: "علاء", shift: "morning" }
        ];
    },
    addWasteLog(log) {
        const list = this.getWasteLogs();
        log.id = Date.now();
        list.unshift(log);
        localStorage.setItem('ror_waste', JSON.stringify(list));
        this.apiCall('/api/operations/waste', 'POST', log);

        // Check daily waste guardrail (>100 SAR)
        const todayStr = log.date || new Date().toISOString().split('T')[0];
        const dayTotal = list.filter(w => w.date === todayStr).reduce((sum, w) => sum + (parseFloat(w.costSAR) || 0), 0);
        if (dayTotal > 100.0) {
            showToast(`تنبيه مالي: إجمالي الهدر اليوم (${dayTotal} ر.س) تجاوز سقف الأمان اليومي (100 ر.س)!`, 'warning');
        } else {
            showToast('تم تسجيل واقعة الهدر بنجاح', 'success');
        }
    },
    deleteWasteLog(id) {
        let list = this.getWasteLogs();
        list = list.filter(w => w.id !== id);
        localStorage.setItem('ror_waste', JSON.stringify(list));
        this.apiCall(`/api/operations/waste/${id}`, 'DELETE');
        showToast('تم حذف سجل الهدر', 'success');
    },

    // 5. Menu Items & 2D Matrix
    getMenuItems() {
        const local = localStorage.getItem('ror_menu');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return [
            { id: 1, name: "V60 إثيوبي شلشلي", category: "مشروبات ساخنة", price: 18.0, cost: 4.5, popularity: 8, classType: "stars", label: "نجم (Star)", badge: "badge-green", icon: "fa-star" },
            { id: 2, name: "فلات وايت RoR", category: "مشروبات ساخنة", price: 15.0, cost: 3.8, popularity: 9, classType: "stars", label: "نجم (Star)", badge: "badge-green", icon: "fa-star" },
            { id: 3, name: "قهوة اليوم كولومبي", category: "مشروبات ساخنة", price: 9.0, cost: 1.8, popularity: 10, classType: "stars", label: "نجم (Star)", badge: "badge-green", icon: "fa-star" },
            { id: 4, name: "سبانش لاتيه RoR", category: "مشروبات ساخنة", price: 19.0, cost: 5.5, popularity: 8, classType: "stars", label: "نجم (Star)", badge: "badge-green", icon: "fa-star" },
            { id: 5, name: "كولد برو مقطر RoR", category: "مشروبات باردة", price: 21.0, cost: 5.2, popularity: 6, classType: "puzzles", label: "لغز (Puzzle)", badge: "badge-blue", icon: "fa-circle-question" },
            { id: 6, name: "كيكة التمر بالكراميل", category: "حلويات ومخبوزات", price: 16.0, cost: 4.0, popularity: 5, classType: "puzzles", label: "لغز (Puzzle)", badge: "badge-blue", icon: "fa-circle-question" },
            { id: 7, name: "كورتادو كلاسيك", category: "مشروبات ساخنة", price: 14.0, cost: 3.2, popularity: 7, classType: "plowhorses", label: "حصان (Plowhorse)", badge: "badge-warning", icon: "fa-horse" },
            { id: 8, name: "شاي إنجليزي فاخر", category: "مشروبات ساخنة", price: 8.0, cost: 1.2, popularity: 3, classType: "dogs", label: "منخفض (Dog)", badge: "badge-danger", icon: "fa-paw" }
        ];
    },
    saveMenuItem(item) {
        const list = this.getMenuItems();
        item.id = Date.now();
        // Classify
        const margin = item.price - item.cost;
        const highContrib = margin >= 10.0;
        const highPop = item.popularity >= 7;
        if (highContrib && highPop) {
            item.classType = 'stars'; item.label = 'نجم (Star)'; item.badge = 'badge-green'; item.icon = 'fa-star';
        } else if (!highContrib && highPop) {
            item.classType = 'plowhorses'; item.label = 'حصان (Plowhorse)'; item.badge = 'badge-warning'; item.icon = 'fa-horse';
        } else if (highContrib && !highPop) {
            item.classType = 'puzzles'; item.label = 'لغز (Puzzle)'; item.badge = 'badge-blue'; item.icon = 'fa-circle-question';
        } else {
            item.classType = 'dogs'; item.label = 'منخفض (Dog)'; item.badge = 'badge-danger'; item.icon = 'fa-paw';
        }
        list.push(item);
        localStorage.setItem('ror_menu', JSON.stringify(list));
        this.apiCall('/api/operations/menu', 'POST', item);
        showToast('تمت إضافة الصنف إلى قائمة المنيو وتصنيفه تلقائياً', 'success');
    },

    // 6. Department Custom Tasks
    getDeptTasks(deptKey = null) {
        const local = localStorage.getItem('ror_dept_tasks');
        let list = [];
        if (local) {
            try { list = JSON.parse(local); } catch (e) {}
        }
        if (deptKey) {
            return list.filter(t => t.deptKey === deptKey);
        }
        return list;
    },
    addDeptTask(task) {
        const list = this.getDeptTasks();
        task.id = `dt-${Date.now()}`;
        task.status = 'pending';
        task.createdAt = new Date().toISOString();
        list.unshift(task);
        localStorage.setItem('ror_dept_tasks', JSON.stringify(list));
        this.apiCall('/api/operations/dept_tasks', 'POST', task);
        showToast('تمت إضافة المهمة إلى القسم بنجاح', 'success');
    },
    updateDeptTaskStatus(taskId, status) {
        const list = this.getDeptTasks();
        const task = list.find(t => t.id === taskId);
        if (task) {
            task.status = status;
            localStorage.setItem('ror_dept_tasks', JSON.stringify(list));
            this.apiCall(`/api/operations/dept_tasks/${taskId}`, 'PUT', { status });
            showToast('تم تحديث حالة المهمة', 'success');
        }
    },
    deleteDeptTask(taskId) {
        let list = this.getDeptTasks();
        list = list.filter(t => t.id !== taskId);
        localStorage.setItem('ror_dept_tasks', JSON.stringify(list));
        this.apiCall(`/api/operations/dept_tasks/${taskId}`, 'DELETE');
        showToast('تم حذف المهمة', 'success');
    },

    // 7. Break-Even Dynamic Config
    getBreakevenConfig() {
        const local = localStorage.getItem('ror_breakeven');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return {
            fixedCosts: 28000,
            avgCupPrice: 18,
            variableRatio: 0.42
        };
    },
    saveBreakevenConfig(cfg) {
        localStorage.setItem('ror_breakeven', JSON.stringify(cfg));
    },

    // 8. Financial Commitments
    getFinancials() {
        const local = localStorage.getItem('ror_financials');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return [
            { id: 1, title: "الإيجار الشهري", amount: 12000, dueDate: "2026-10-01", paymentMethod: "تحويل بنكي", status: "paid", type: "fixed" },
            { id: 2, title: "فاتورة الكهرباء والمياه", amount: 3200, dueDate: "2026-09-20", paymentMethod: "SADAD", status: "pending", type: "fixed" },
            { id: 3, title: "المقابل المالي والتراخيص", amount: 800, dueDate: "2026-09-15", paymentMethod: "تحويل بنكي", status: "paid", type: "fixed" },
            { id: 4, title: "التأمينات الاجتماعية GOSI", amount: 1800, dueDate: "2026-10-10", paymentMethod: "خصم تلقائي", status: "paid", type: "fixed" },
            { id: 5, title: "اشتراك نظام نقاط البيع Foodics", amount: 299, dueDate: "2026-10-05", paymentMethod: "بطاقة ائتمان", status: "paid", type: "fixed" },
            { id: 6, title: "شحنة بن أخضر كولومبي وإثيوبي", amount: 14500, dueDate: "2026-09-25", paymentMethod: "تحويل بنكي", status: "pending", type: "variable" }
        ];
    },

    // 9. Development Pipeline
    getDevPipeline() {
        const local = localStorage.getItem('ror_dev_pipeline');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return [
            { id: 1, category: "training", title: "برنامج تدريب الباريستا المتقدم (SCA Foundation)", description: "تدريب عملي على تكنيك تبخير الحليب ومعايرة طواحين الإسبريسو", progressPct: 75, owner: "علاء يوسف", targetDate: "2026-10-01", status: "in-progress" },
            { id: 2, category: "sop", title: "دليل تشغيل وافتتاح محطة البار اليومية", description: "معايير النظافة الصباحية، تسخين البويلرات، واختبار جودة المياه", progressPct: 90, owner: "عبد الله القصير", targetDate: "2026-09-25", status: "in-progress" },
            { id: 3, category: "automation", title: "ربط تلقائي بين نظام المحمصة ونقاط البيع POS", description: "مزامنة فورية لأرصدة أكياس الربع مع كاشير الفرع والمتجر", progressPct: 60, owner: "جود القصير", targetDate: "2026-10-15", status: "in-progress" },
            { id: 4, category: "innovation", title: "تطوير خط إنتاج قهوة باردة معلبة RTD", description: "تجارب تحضير كولد برو نيترو وتعبئة عبوات زجاجية لعملاء الجملة", progressPct: 40, owner: "علاء + جود", targetDate: "2026-11-01", status: "in-progress" }
        ];
    },

    // 10. Org Structure Roles
    getOrgStructure() {
        const local = localStorage.getItem('ror_org_structure');
        if (local) {
            try { 
                const parsed = JSON.parse(local);
                return parsed.roles || [];
            } catch (e) {}
        }
        return [];
    },
    saveOrgStructure(roles) {
        localStorage.setItem('ror_org_structure', JSON.stringify({ roles }));
        this.apiCall('/api/operations/org_structure', 'POST', { roles });
    },

    // Background server initial sync
    async syncWithBackend() {
        const res = await this.apiCall('/api/system/backup');
        if (res && res.data) {
            // Server is online with live database
            const statusEl = document.getElementById('dayNightStatus');
            if (statusEl) {
                const dot = statusEl.querySelector('.pulse-green-dot');
                if (dot) dot.setAttribute('title', 'متصل بالخادم المحلي وقاعدة البيانات SQLite');
            }
        }
    }
};

// ===================================================================
// INITIALIZATION ON DOM READY
// ===================================================================
document.addEventListener('DOMContentLoaded', function () {
    initializeSidebar();
    initializeDateTime();
    initializeUserDropdown();
    initializeDarkMode();
    loadPage('dashboard');
    setInterval(updateDateTime, 1000);

    // Initial background sync
    setTimeout(() => {
        if (window.DataService) window.DataService.syncWithBackend();
    }, 500);
});

// ====== DARK MODE TOGGLE (PERSISTENT, ICON-AWARE) ======
function initializeDarkMode() {
    const savedTheme = localStorage.getItem('ror_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('darkModeIcon');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('ror_theme', newTheme);

    const icon = document.getElementById('darkModeIcon');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    showToast(
        newTheme === 'dark' ? 'تم تفعيل الوضع الداكن (Night Mode)' : 'تم تفعيل الوضع الفاتح (Day Mode)',
        'success'
    );

    // Update Chart.js defaults to match theme
    if (typeof Chart !== 'undefined') {
        const isDark = newTheme === 'dark';
        Chart.defaults.color = isDark ? '#94A3B8' : '#64748B';
        Chart.defaults.borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0, 0, 0, 0.05)';
        Chart.defaults.plugins.tooltip.backgroundColor = isDark ? '#1D1F24' : '#0F172A';
        // Re-render active chart if visible
        if (window.currentPage) {
            setTimeout(() => {
                if (typeof initializePageSpecific === 'function') {
                    initializePageSpecific(window.currentPage);
                }
            }, 150);
        }
    }
}

// ====== SIDEBAR & WORKSPACE PANELS ======
function initializeSidebar() {
    const sidebar        = document.getElementById('sidebar');
    const toggleBtn      = document.getElementById('toggleSidebar');
    const mobileToggle   = document.getElementById('toggleSidebarMobile');
    const togglePanelBtn = document.getElementById('toggleRightPanel');
    const sidePanel      = document.getElementById('sidePanel');
    const navPageItems   = document.querySelectorAll('.nav-item[data-page]');
    const expandables    = document.querySelectorAll('.nav-item.expandable');

    // Desktop Toggle collapse (smooth 0.3s transition)
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            window.sidebarCollapsed = sidebar.classList.contains('collapsed');
        });
    }

    // Mobile Sidebar Toggle
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }

    // Right Side Panel Toggle
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
            }
        });
    }

    // Expandable submenus
    expandables.forEach(item => {
        item.addEventListener('click', function () {
            if (window.sidebarCollapsed) return;
            const submenuId = this.id.replace('Toggle', 'Submenu');
            const submenu   = document.getElementById(submenuId);
            if (!submenu) return;

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

    // Page navigation click handler
    navPageItems.forEach(item => {
        item.addEventListener('click', function () {
            const page = this.getAttribute('data-page');
            loadPage(page);
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            if (sidebar) sidebar.classList.remove('mobile-open');
        });
    });

    // Top Search Input Filter Hook
    const topSearchInput = document.getElementById('topSearchInput');
    if (topSearchInput) {
        topSearchInput.addEventListener('input', function () {
            const query = this.value.trim();
            if (window.currentPage === 'org-chart' && typeof searchBlueprint === 'function') {
                searchBlueprint(query);
            } else if (window.currentPage === '40-tasks' && typeof filterTasksByText === 'function') {
                filterTasksByText(query);
            } else if (window.currentPage === 'menu-engineering' && typeof filterMenuByText === 'function') {
                filterMenuByText(query);
            }
        });
    }
}

// ====== DATE & TIME + DYNAMIC TIME-AWARE GREETING (WESTERN NUMERALS) ======
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
    } else if (hour >= 12 && hour < 17) {
        greetingText = `ظهرًا مباركًا، ${partner.shortName}`;
        greetingIcon = 'fa-sun text-amber';
    } else {
        greetingText = `مساء الخير، ${partner.shortName}`;
        greetingIcon = 'fa-moon text-indigo';
    }

    const greetingTextEl = document.getElementById('greetingText');
    const greetingIconEl = document.getElementById('greetingIcon');
    if (greetingTextEl) greetingTextEl.textContent = greetingText;
    if (greetingIconEl) greetingIconEl.className = `fas ${greetingIcon}`;

    // Western Numerals (0-9) via 'ar-SA-u-nu-latn'
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

// ====== MULTI-PARTNER ACCOUNT SWITCHER ======
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

        // Support both partner-item and partner-switch-item
        document.querySelectorAll('.partner-item, .partner-switch-item').forEach(item => {
            const itemKey = item.getAttribute('data-user') || item.getAttribute('data-partner');
            if (itemKey === partnerKey) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        updateDateTime();
    }

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

    // Partner items switcher click hook
    document.querySelectorAll('.partner-item, .partner-switch-item').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const partnerKey = this.getAttribute('data-user') || this.getAttribute('data-partner');
            if (partnerKey && PARTNERS[partnerKey]) {
                localStorage.setItem('ror_active_partner', partnerKey);
                updateActivePartnerUI(partnerKey);
                popover.classList.remove('show');
                triggerBtn.setAttribute('aria-expanded', 'false');
                showToast(`تم تبديل الحساب النشط إلى: ${PARTNERS[partnerKey].name}`, 'success');
            }
        });
    });
}

// ====== SAFE PAGE LOADER (ZERO BLANK STATES) ======
function loadPage(page) {
    window.currentPage = page;
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
        'dept-finance':           { title: 'قسم المالية والحسابات',                       fn: () => getDepartmentContent('finance') },
        'dept-procurement':       { title: 'قسم المشتريات والتوريد وسلاسل الإمداد',       fn: () => getDepartmentContent('procurement') },
        'org-chart':              { title: 'الهيكل التنظيمي',                              fn: getOrgChartContent },
        'team-roles':             { title: 'مهام فريق RoR',                               fn: getTeamRolesContent },
        'mind-map':               { title: 'الخريطة الذهنية للفريق',                       fn: getMindMapContent },
        'development':            { title: 'التطوير والنمو',                               fn: getDevelopmentContent }
    };

    const pageData = pages[page] || pages['dashboard'];

    // Safe null-check for pageTitle element
    if (pageTitle) {
        pageTitle.textContent = pageData.title;
    }

    if (contentArea) {
        try {
            contentArea.innerHTML = pageData.fn();
        } catch (err) {
            console.error('Error rendering page:', page, err);
            contentArea.innerHTML = `<div class="alert danger">حدث خطأ أثناء تحميل الصفحة (${page}): ${err.message}</div>`;
        }
    }

    // Post-render specific initializations
    if (page === 'org-chart' && typeof refreshOrgCardsFromStorage === 'function') {
        refreshOrgCardsFromStorage();
    }

    if (page === 'breakeven' && typeof initializeBreakevenSliders === 'function') {
        initializeBreakevenSliders();
    }

    if (typeof initializePageSpecific === 'function') {
        setTimeout(() => initializePageSpecific(page), 50);
    }
}

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
// 15. MODALS CONTROLLER & FORM HANDLERS
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

// Backup & Restore Handlers
window.openBackupModal = function() {
    const modal = document.getElementById('backupModal');
    if (modal) modal.classList.add('active');
};
window.closeBackupModal = function() {
    const modal = document.getElementById('backupModal');
    if (modal) modal.classList.remove('active');
};

window.exportSystemBackup = function() {
    const dump = {
        metadata: {
            system: "RoR Enterprise Suite",
            version: "2.4.0-PROD",
            exportedAt: new Date().toISOString()
        },
        data: {
            tasks: window.DataService.getTasks(),
            cafe_sales: window.DataService.getCafeSales(),
            roastery_sales: window.DataService.getRoasterySales(),
            waste_logs: window.DataService.getWasteLogs(),
            menu_items: window.DataService.getMenuItems(),
            dept_tasks: window.DataService.getDeptTasks(),
            financial_commitments: window.DataService.getFinancials(),
            dev_pipeline: window.DataService.getDevPipeline(),
            breakeven_config: window.DataService.getBreakevenConfig()
        }
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ror_system_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('تم تصدير النسخة الاحتياطية بنجاح إلى ملف JSON', 'success');
};

window.importSystemBackup = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (!parsed.data) throw new Error('تنسيق ملف غير صالح');

            const d = parsed.data;
            if (d.tasks) localStorage.setItem('ror_tasks', JSON.stringify(d.tasks));
            if (d.cafe_sales) localStorage.setItem('ror_cafe_sales', JSON.stringify(d.cafe_sales));
            if (d.roastery_sales) localStorage.setItem('ror_roast_sales', JSON.stringify(d.roastery_sales));
            if (d.waste_logs) localStorage.setItem('ror_waste', JSON.stringify(d.waste_logs));
            if (d.menu_items) localStorage.setItem('ror_menu', JSON.stringify(d.menu_items));
            if (d.dept_tasks) localStorage.setItem('ror_dept_tasks', JSON.stringify(d.dept_tasks));
            if (d.financial_commitments) localStorage.setItem('ror_financials', JSON.stringify(d.financial_commitments));
            if (d.dev_pipeline) localStorage.setItem('ror_dev_pipeline', JSON.stringify(d.dev_pipeline));
            if (d.breakeven_config) localStorage.setItem('ror_breakeven', JSON.stringify(d.breakeven_config));

            // Sync with backend API
            await window.DataService.apiCall('/api/system/backup', 'POST', parsed);

            closeBackupModal();
            showToast('تمت استعادة النسخة الاحتياطية بنجاح!', 'success');
            setTimeout(() => loadPage(window.currentPage), 300);
        } catch (err) {
            showToast('خطأ في استعادة النسخة الاحتياطية: ' + err.message, 'error');
        }
    };
    reader.readAsText(file);
};

// Toast notification helper
function showToast(message, type = 'success') {
    let toast = document.getElementById('rorToast');
    if (!toast) return;

    const msgEl = document.getElementById('rorToastMessage');
    if (msgEl) msgEl.textContent = message;

    toast.className = `ror-toast ${type} show`;
    const icon = toast.querySelector('.toast-icon');
    if (icon) {
        icon.className = `toast-icon fas ${type === 'success' ? 'fa-circle-check' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-xmark'}`;
    }

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3800);
}
