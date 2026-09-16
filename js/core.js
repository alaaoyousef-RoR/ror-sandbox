/**
 * RoR Enterprise Suite - Core Architecture & Routing Engine
 * System Version: 2.4.0-MODULAR
 * Modules: DataService (Offline-first), Navigation Router, Theme Engine, Modals & Toasts
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
            if (!res.ok) return null;
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
        'dashboard':              { title: 'لوحة التحكم الرئيسية',                        fn: () => (window.getDashboardContent || getDashboardContent)() },
        'kpi-dashboard':          { title: 'لوحة المؤشرات والأداء',                       fn: () => (window.getKPIDashboardContent || getKPIDashboardContent)() },
        'weekly-plan':            { title: 'الخطة الأسبوعية',                              fn: () => (window.getWeeklyPlanContent || getWeeklyPlanContent)() },
        '40-tasks':               { title: 'خطة الـ 40 مهمة',                             fn: () => (window.get40TasksContent || get40TasksContent)() },
        'menu-engineering':       { title: 'هندسة القائمة',                                fn: () => (window.getMenuEngineeringContent || getMenuEngineeringContent)() },
        'breakeven':              { title: 'نقطة التعادل',                                 fn: () => (window.getBreakevenContent || getBreakevenContent)() },
        'raci-matrix':            { title: 'مصفوفة المسؤوليات (RACI)',                     fn: () => (window.getRACIMatrixContent || getRACIMatrixContent)() },
        'waste-cashflow':         { title: 'الهدر والسيولة',                               fn: () => (window.getWasteCashflowContent || getWasteCashflowContent)() },
        'vision-dashboard':       { title: 'الرؤية الانتقالية ولوحة الأداء المالي',        fn: () => (window.getVisionDashboardContent || getVisionDashboardContent)() },
        'financial-commitments':  { title: 'حصر الالتزامات والمصاريف المالية',             fn: () => (window.getFinancialCommitmentsContent || getFinancialCommitmentsContent)() },
        'cafe-sales':             { title: 'تقارير مبيعات المقهى (البار)',                 fn: () => (window.getCafeSalesContent || getCafeSalesContent)() },
        'roastery-sales':         { title: 'تقارير مبيعات المحمصة',                        fn: () => (window.getRoasterySalesContent || getRoasterySalesContent)() },
        'revolution-plan':        { title: 'خطة ثورة RoR التنفيذية',                      fn: () => (window.getRevolutionPlanContent || getRevolutionPlanContent)() },
        'dept-production':        { title: 'قسم المحمصة والإنتاج',                        fn: () => getDepartmentContent('production') },
        'dept-quality':           { title: 'قسم ضبط الجودة والبحث والتطوير',              fn: () => getDepartmentContent('quality') },
        'dept-marketing':         { title: 'قسم التسويق والعلامة التجارية',               fn: () => getDepartmentContent('marketing') },
        'dept-sales':             { title: 'قسم المبيعات وتطوير الأعمال',                 fn: () => getDepartmentContent('sales') },
        'dept-ecommerce':         { title: 'قسم التجارة الإلكترونية واللوجستيات',          fn: () => getDepartmentContent('ecommerce') },
        'dept-maintenance':       { title: 'قسم الصيانة والدعم الفني',                    fn: () => getDepartmentContent('maintenance') },
        'dept-hr':                { title: 'قسم الموارد البشرية',                         fn: () => getDepartmentContent('hr') },
        'dept-finance':           { title: 'قسم المالية والحسابات',                       fn: () => getDepartmentContent('finance') },
        'dept-procurement':       { title: 'قسم المشتريات والتوريد وسلاسل الإمداد',       fn: () => getDepartmentContent('procurement') },
        'org-chart':              { title: 'الهيكل التنظيمي',                              fn: () => (window.getOrgChartContent || getOrgChartContent)() },
        'team-roles':             { title: 'مهام فريق RoR',                               fn: () => (window.getTeamRolesContent || getTeamRolesContent)() },
        'mind-map':               { title: 'الخريطة الذهنية للفريق',                       fn: () => (window.getMindMapContent || getMindMapContent)() },
        'development':            { title: 'التطوير والنمو',                               fn: () => (window.getDevelopmentContent || getDevelopmentContent)() }
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
// BACKUP & RESTORE UTILITY HANDLERS
// ===================================================================
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


// Export globals to window
window.loadPage = loadPage;
window.showToast = showToast;
