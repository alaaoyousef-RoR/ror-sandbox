#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RoR Enterprise Suite - Production REST API & SQLite Data Service
Version: 2.4.0-PROD
"""

import os
import json
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'ror_system.db')

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')

# ====== DATABASE CONNECTION HELPER ======
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ====== DATABASE INITIALIZATION & SEEDING ======
def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Operational 40-Tasks
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY,
            week INTEGER NOT NULL,
            task TEXT NOT NULL,
            cat TEXT NOT NULL,
            status TEXT NOT NULL,
            responsible TEXT NOT NULL,
            dueDate TEXT,
            completedAt TEXT,
            notes TEXT
        )
    ''')

    # 2. Café Bar Shift Reports (Aref & Elem)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cafe_sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            shift TEXT NOT NULL,
            barista TEXT NOT NULL,
            cups INTEGER NOT NULL,
            desserts INTEGER NOT NULL,
            revenue REAL NOT NULL,
            tickets INTEGER NOT NULL,
            avgTicket REAL NOT NULL,
            notes TEXT,
            createdAt TEXT NOT NULL
        )
    ''')

    # 3. Roastery Batches & B2B Invoices
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS roastery_sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            client TEXT NOT NULL,
            roastProfile TEXT,
            greenKg REAL NOT NULL,
            roastedKg REAL NOT NULL,
            roastLossPct REAL NOT NULL,
            pricePerKg REAL NOT NULL,
            type TEXT NOT NULL,
            paid REAL NOT NULL,
            pending REAL NOT NULL,
            status TEXT NOT NULL,
            notes TEXT,
            createdAt TEXT NOT NULL
        )
    ''')

    # 4. Waste Tracking
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS waste_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            item TEXT NOT NULL,
            quantity REAL NOT NULL,
            unit TEXT NOT NULL,
            costSAR REAL NOT NULL,
            reason TEXT NOT NULL,
            reportedBy TEXT NOT NULL,
            shift TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )
    ''')

    # 5. Menu Engineering
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            cost REAL NOT NULL,
            popularity INTEGER NOT NULL,
            classType TEXT NOT NULL,
            label TEXT NOT NULL,
            badge TEXT NOT NULL,
            icon TEXT NOT NULL
        )
    ''')

    # 6. Department Custom Tasks
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dept_tasks (
            id TEXT PRIMARY KEY,
            deptKey TEXT NOT NULL,
            title TEXT NOT NULL,
            assignedTo TEXT NOT NULL,
            priority TEXT NOT NULL,
            dueDate TEXT NOT NULL,
            status TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )
    ''')

    # 7. Org Blueprint Assignments
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS org_roles (
            id TEXT PRIMARY KEY,
            holder TEXT NOT NULL,
            startDate TEXT NOT NULL,
            salary INTEGER NOT NULL,
            assignedAt TEXT NOT NULL
        )
    ''')

    # 8. Financial Commitments
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS financial_commitments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            dueDate TEXT NOT NULL,
            paymentMethod TEXT NOT NULL,
            status TEXT NOT NULL,
            type TEXT NOT NULL
        )
    ''')

    # 9. Development & Growth Pipeline
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dev_pipeline (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            progressPct INTEGER NOT NULL,
            owner TEXT NOT NULL,
            targetDate TEXT NOT NULL,
            status TEXT NOT NULL
        )
    ''')

    conn.commit()

    # Seed initial data if tables are empty
    seed_data_if_empty(cursor)
    conn.commit()
    conn.close()

def seed_data_if_empty(cursor):
    # Check tasks
    cursor.execute('SELECT COUNT(*) FROM tasks')
    if cursor.fetchone()[0] == 0:
        tasks_seed = [
            (1, 1, "حصر جميع الأصول الثابتة والمعدات وتوثيق الضمانات لمقهى RoR.", "مالية وتكاليف", "completed", "علاء"),
            (2, 1, "إدخال بيانات الموردين الحاليين وتثبيت شروط الدفع والائتمان.", "مالية وتكاليف", "completed", "أنس"),
            (3, 1, "إعداد وتدقيق قائمة المكونات الأولية (Raw Materials) لجميع المشروبات والأطباق.", "تشغيلية", "completed", "عبدالله"),
            (4, 1, "تعيين أسعار التكلفة المعيارية (Standard Recipe Cost) للمشروبات والوجبات الرئيسية.", "مالية وتكاليف", "completed", "علاء"),
            (5, 1, "ضبط أرصدة المخزون الافتتاحية للمستودع الرئيسي والثلاجات الفرعية.", "تشغيلية", "completed", "عبدالله"),
            (6, 2, "توزيع المهام التشغيلية اليومية لموظفي صالة RoR والبارتندرز والمطبخ.", "تشغيلية", "completed", "عبدالله"),
            (7, 2, "تفعيل مصفوفة المسؤوليات (RACI) وتحديد من يملك القرار النهائي لكل قسم.", "حوكمة", "completed", "علاء"),
            (8, 2, "إعداد كتيب الموظف الداخلي (Employee Handbook) وتوضيح معايير خدمة RoR.", "حوكمة", "completed", "أنس"),
            (9, 2, "جدولة فترات العمل (Shift Schedule) وتوزيع ساعات الذروة والهدوء أسبوعياً.", "تشغيلية", "completed", "عبدالله"),
            (10, 2, "تفعيل نظام تقييم الأداء الأسبوعي الأولي لفريق الخدمة والتحضير.", "جودة وتطوير", "completed", "علاء"),
            (11, 3, "توثيق إجراءات التحضير المسبق (Prep Sheet) لخط الإنتاج الساخن والبارد.", "تشغيلية", "completed", "عبدالله"),
            (12, 3, "إطلاق سجل تتبع الهدر اليومي (Daily Waste Log) في المطبخ والبار.", "جودة وتطوير", "completed", "علاء"),
            (13, 3, "تحديد الحد الأعلى والحد الأدنى للطلب (Min/Max Par Levels) لكل صنف بالمخزن.", "تشغيلية", "completed", "عبدالله"),
            (14, 3, "فحص وضبط معايير معايرة المكائن (Espresso Calibration, Grinder, Ovens).", "جودة وتطوير", "completed", "علاء"),
            (15, 3, "تطبيق آلية التدقيق على الاستلام ودرجات حرارة الأغذية الواردة.", "جودة وتطوير", "completed", "عبدالله"),
            (16, 4, "ربط وتحليل بيانات نظام البيع (POS) لاستخراج حجم المبيعات الفعلي للأسابيع الماضية.", "مالية وتكاليف", "completed", "أنس"),
            (17, 4, "تصنيف أصناف المنيو في جدول أولي وفق هندسة القائمة (Stars, Puzzles, Plowhorses, Dogs).", "تسويقية", "completed", "علاء"),
            (18, 4, "مراجعة أسعار بيع المشروبات الأكثر طلباً بـ RoR ومقارنتها بأسعار المنافسين.", "تسويقية", "completed", "جود"),
            (19, 4, "حساب هامش الربح الإجمالي (Gross Margin) لكل تصنيف في منيو RoR الحالي.", "مالية وتكاليف", "completed", "أنس"),
            (20, 4, "اتخاذ قرار مبدئي بشأن تعديل أسعار بيع الأصناف أو استبدال الأصناف الضعيفة.", "حوكمة", "completed", "علاء"),
            (21, 5, "مراجعة حركة النقد اليومية (Daily Cash Flow Drop) ومطابقتها مع تقارير المبيعات.", "مالية وتكاليف", "completed", "أنس"),
            (22, 5, "جدولة فواتير الموردين المستحقة وتوزيع دفعاتها لتجنب انقطاع التوريد.", "مالية وتكاليف", "completed", "أنس"),
            (23, 5, "حصر الذمم المدينة (مبيعات الشركات/الفعاليات لـ RoR) ومتابعة تحصيل المدفوعات.", "مبيعات وجملة", "completed", "جود"),
            (24, 5, "إنشاء صندوق النثرية (Petty Cash) وتحديد صلاحيات صرفه وتوثيق فواتيره السريعة.", "مالية وتكاليف", "completed", "أنس"),
            (25, 5, "تحليل المصاريف التشغيلية الثابتة والمتغيرة وربطها بنقطة التعادل المستهدفة.", "مالية وتكاليف", "completed", "علاء"),
            (26, 6, "تطبيق قائمة التدقيق البيئية والصحية والبلدية الداخلية بـ RoR.", "جودة وتطوير", "completed", "عبدالله"),
            (27, 6, "تفعيل منبه التراخيص القانونية والصحية وفترات تجديد سجلات وتراخيص مقهى RoR.", "حوكمة", "completed", "أنس"),
            (28, 6, "إجراء فحص سري للمتسوق الخفي (Mystery Shopper) لتقييم كفاءة الخدمة وسرعتها.", "جودة وتطوير", "completed", "جود"),
            (29, 6, "مراجعة شكاوى وملاحظات العملاء على منصات التقييم (Google Maps / Social Media).", "تسويقية", "completed", "جود"),
            (30, 6, "تدريب فريق العمل بـ RoR على سيناريوهات التعامل مع ضغط العمل وشكاوى العملاء المباشرة.", "تشغيلية", "completed", "عبدالله"),
            (31, 7, "حساب تكلفة الغذاء الفعلية (Actual Food Cost) ومقارنتها بالمعيارية المخطط لها.", "مالية وتكاليف", "completed", "علاء"),
            (32, 7, "احتساب تكلفة العمالة الإجمالية (Labor Cost %) كنسبة مئوية من المبيعات الفعلية.", "مالية وتكاليف", "completed", "أنس"),
            (33, 7, "تحديد التكلفة الأساسية (Prime Cost) والتأكد من أنها ضمن النطاق المالي الآمن (<60%).", "مالية وتكاليف", "in-progress", "علاء"),
            (34, 7, "إعداد تقرير التباين الأسبوعي (Variance Report) بين الاستهلاك الفعلي والمعياري للمواد.", "جودة وتطوير", "in-progress", "عبدالله"),
            (35, 7, "وضع خطة عمل فورية لمعالجة الفروقات في المواد المرتفعة التكلفة.", "تشغيلية", "pending", "علاء"),
            (36, 8, "تطوير لوحة قيادة الأداء النهائية (Final Performance Dashboard) الشاملة لجميع المؤشرات.", "حوكمة", "pending", "علاء"),
            (37, 8, "عرض التقرير المالي النهائي ومقارنة النتائج الفعلية بالأهداف المستهدفة بـ RoR.", "مالية وتكاليف", "pending", "أنس"),
            (38, 8, "تثبيت مصفوفة الصلاحيات الدائمة (Final RACI) وتحديث الوصف الوظيفي لجميع العاملين.", "حوكمة", "pending", "عبدالله"),
            (39, 8, "تسليم أدلة التشغيل القياسية المحدثة (SOPs) لمدراء الفروع والورديات.", "تشغيلية", "pending", "علاء"),
            (40, 8, "عقد اجتماع الإغلاق والتقييم النهائي مع الإدارة واعتماد خطة التوسع المستقبلية.", "حوكمة", "pending", "علاء")
        ]
        cursor.executemany(
            'INSERT INTO tasks (id, week, task, cat, status, responsible) VALUES (?, ?, ?, ?, ?, ?)',
            tasks_seed
        )

    # Check cafe sales
    cursor.execute('SELECT COUNT(*) FROM cafe_sales')
    if cursor.fetchone()[0] == 0:
        cafe_seed = [
            ("2026-09-15", "صباحي (عارف)", "عارف", 72, 14, 1320.0, 53, 24.9, "إقبال ممتاز على قهوة اليوم والكرواسون", datetime.now().isoformat()),
            ("2026-09-14", "مسائي (علم)", "علم", 92, 22, 1720.0, 64, 26.8, "ذروة مسائية عالية ومبيعات كولد برو ممتازة", datetime.now().isoformat()),
            ("2026-09-14", "صباحي (عارف)", "عارف", 65, 11, 1185.0, 48, 24.6, "حركة منتظمة ومعايرة ممتازة للفلتر", datetime.now().isoformat()),
            ("2026-09-13", "مسائي (علم)", "علم", 88, 19, 1590.0, 60, 26.5, "طلب عالي على الحلى والمشروبات الباردة", datetime.now().isoformat()),
            ("2026-09-13", "صباحي (عارف)", "عارف", 58, 9, 1040.0, 42, 24.7, "فترة الصباح هادئة ومبيعات بن منزلي", datetime.now().isoformat())
        ]
        cursor.executemany(
            '''INSERT INTO cafe_sales (date, shift, barista, cups, desserts, revenue, tickets, avgTicket, notes, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            cafe_seed
        )

    # Check roastery sales
    cursor.execute('SELECT COUNT(*) FROM roastery_sales')
    if cursor.fetchone()[0] == 0:
        roast_seed = [
            ("2026-09-15", "مقهى الأفق (حائل)", "بروفايل إسبريسو كولومبي", 58.0, 50.0, 13.8, 75.0, "wholesale", 3750.0, 0.0, "مكتمل", "تسليم مباشر عبر طاقة التحميص الأساسية", datetime.now().isoformat()),
            ("2026-09-14", "مبيعات رف الفرع (أرباع 250جم)", "بروفايل إثيوبي شلشلي", 29.0, 25.0, 13.8, 110.0, "retail", 2750.0, 0.0, "مكتمل", "تغليف 100 كيس ربع للرف", datetime.now().isoformat()),
            ("2026-09-12", "سلسلة مقاهي نجد المختصة", "خلطة RoR التأسيسية", 93.0, 80.0, 14.0, 82.0, "wholesale", 6560.0, 0.0, "مكتمل", "عقد توريد شهري", datetime.now().isoformat()),
            ("2026-09-10", "متجر RoR الإلكتروني (أرباع 250جم)", "محصول كوستاريكا تارازو", 21.0, 18.0, 14.3, 95.0, "retail", 1710.0, 0.0, "مكتمل", "توزيع طلبيات الشحن السريع", datetime.now().isoformat())
        ]
        cursor.executemany(
            '''INSERT INTO roastery_sales (date, client, roastProfile, greenKg, roastedKg, roastLossPct, pricePerKg, type, paid, pending, status, notes, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            roast_seed
        )

    # Check waste logs
    cursor.execute('SELECT COUNT(*) FROM waste_logs')
    if cursor.fetchone()[0] == 0:
        waste_seed = [
            ("2026-09-15", "coffee", "بن مطحون (معايرة الصباح)", 0.45, "كجم", 45.0, "معايرة طاحونة الإسبريسو بعد تنظيف الشفرات", "عارف", "morning", datetime.now().isoformat()),
            ("2026-09-15", "milk", "حليب طازج نادك", 2.0, "لتر", 18.0, "بقايا تبخير زائد وقت الذروة", "علم", "evening", datetime.now().isoformat()),
            ("2026-09-14", "pastry", "كرواسون زعتر وجبن", 3.0, "قطعة", 24.0, "انتهاء الصلاحية اليومية للعرض", "علم", "evening", datetime.now().isoformat()),
            ("2026-09-13", "coffee", "حبوب محروقة (أول دفعة)", 0.5, "كجم", 35.0, "ارتفاع حرارة الدرام المفاجئ", "علاء", "morning", datetime.now().isoformat())
        ]
        cursor.executemany(
            '''INSERT INTO waste_logs (date, category, item, quantity, unit, costSAR, reason, reportedBy, shift, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            waste_seed
        )

    # Check menu items
    cursor.execute('SELECT COUNT(*) FROM menu_items')
    if cursor.fetchone()[0] == 0:
        menu_seed = [
            ("V60 إثيوبي شلشلي", "مشروبات ساخنة", 18.0, 4.5, 8, "stars", "نجم (Star)", "badge-green", "fa-star"),
            ("فلات وايت RoR", "مشروبات ساخنة", 15.0, 3.8, 9, "stars", "نجم (Star)", "badge-green", "fa-star"),
            ("قهوة اليوم كولومبي", "مشروبات ساخنة", 9.0, 1.8, 10, "stars", "نجم (Star)", "badge-green", "fa-star"),
            ("سبانش لاتيه RoR", "مشروبات ساخنة", 19.0, 5.5, 8, "stars", "نجم (Star)", "badge-green", "fa-star"),
            ("كولد برو مقطر RoR", "مشروبات باردة", 21.0, 5.2, 6, "puzzles", "لغز (Puzzle)", "badge-blue", "fa-circle-question"),
            ("كيكة التمر بالكراميل", "حلويات ومخبوزات", 16.0, 4.0, 5, "puzzles", "لغز (Puzzle)", "badge-blue", "fa-circle-question"),
            ("كورتادو كلاسيك", "مشروبات ساخنة", 14.0, 3.2, 7, "plowhorses", "حصان (Plowhorse)", "badge-warning", "fa-horse"),
            ("شاي إنجليزي فاخر", "مشروبات ساخنة", 8.0, 1.2, 3, "dogs", "منخفض (Dog)", "badge-danger", "fa-paw")
        ]
        cursor.executemany(
            '''INSERT INTO menu_items (name, category, price, cost, popularity, classType, label, badge, icon)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            menu_seed
        )

    # Check financial commitments
    cursor.execute('SELECT COUNT(*) FROM financial_commitments')
    if cursor.fetchone()[0] == 0:
        fin_seed = [
            ("الإيجار الشهري", 12000.0, "2026-10-01", "تحويل بنكي", "paid", "fixed"),
            ("فاتورة الكهرباء والمياه", 3200.0, "2026-09-20", "SADAD", "pending", "fixed"),
            ("المقابل المالي والتراخيص", 800.0, "2026-09-15", "تحويل بنكي", "paid", "fixed"),
            ("التأمينات الاجتماعية GOSI", 1800.0, "2026-10-10", "خصم تلقائي", "paid", "fixed"),
            ("اشتراك نظام نقاط البيع Foodics", 299.0, "2026-10-05", "بطاقة ائتمان", "paid", "fixed"),
            ("شحنة بن أخضر كولومبي وإثيوبي", 14500.0, "2026-09-25", "تحويل بنكي", "pending", "variable")
        ]
        cursor.executemany(
            '''INSERT INTO financial_commitments (title, amount, dueDate, paymentMethod, status, type)
               VALUES (?, ?, ?, ?, ?, ?)''',
            fin_seed
        )

    # Check dev pipeline
    cursor.execute('SELECT COUNT(*) FROM dev_pipeline')
    if cursor.fetchone()[0] == 0:
        dev_seed = [
            ("training", "برنامج تدريب الباريستا المتقدم (SCA Foundation)", "تدريب عملي على تكنيك الحليب والتبخير ومعايرة الطواحين بدقة", 75, "علاء يوسف", "2026-10-01", "in-progress"),
            ("sop", "دليل تشغيل وافتتاح محطة البار اليومية", "خطوات الفحص الصباحي، المعايرة، وتعقيم أسطح التحضير والأدوات", 90, "عبد الله القصير", "2026-09-25", "in-progress"),
            ("automation", "ربط تلقائي بين نظام المحمصة ونقاط البيع POS", "مزامنة لحظية لحركة أرصدة أكياس الربع مع كاشير الفرع", 60, "جود القصير", "2026-10-15", "in-progress"),
            ("innovation", "تطوير خط إنتاج قهوة باردة معلبة RTD", "تجارب تحضير كولد برو نيترو وتعبئة عبوات زجاجية لعملاء الجملة", 40, "علاء + جود", "2026-11-01", "in-progress")
        ]
        cursor.executemany(
            '''INSERT INTO dev_pipeline (category, title, description, progressPct, owner, targetDate, status)
               VALUES (?, ?, ?, ?, ?, ?, ?)''',
            dev_seed
        )

    # Check dept tasks
    cursor.execute('SELECT COUNT(*) FROM dept_tasks')
    if cursor.fetchone()[0] == 0:
        dept_seed = [
            ("dept_task_1", "production", "معايرة الحماصة الرائدة لدفعة البن الإثيوبي ييرغاتشيف", "علاء يوسف", "high", "2026-09-22", "pending", "2026-09-16 09:00:00"),
            ("dept_task_2", "quality", "جلسة كبينغ دورية لعينات التحميص الأسبوعية (SCA Cupping)", "علاء يوسف", "high", "2026-09-23", "completed", "2026-09-15 14:00:00"),
            ("dept_task_3", "marketing", "إطلاق حملة تيك توك وريلز على محصول كولومبيا هويلا الجديد", "جود القصير", "medium", "2026-09-24", "pending", "2026-09-16 10:00:00"),
            ("dept_task_4", "sales", "التواصل مع 5 مقاهٍ مستهدفة لتوريد قهوة الإسبريسو بالجملة", "جود القصير", "high", "2026-09-25", "pending", "2026-09-16 11:30:00"),
            ("dept_task_5", "maintenance", "استبدال فلاتر المياه ومعايرة ضغط بار مكينة الإسبريسو", "عبد الله القصير", "medium", "2026-09-26", "pending", "2026-09-16 12:00:00"),
            ("dept_task_6", "finance", "إقفال مسيرات الرواتب لشهر سبتمبر ومطابقة ZATCA", "أنس الصفدي", "high", "2026-09-28", "pending", "2026-09-16 13:00:00")
        ]
        cursor.executemany(
            '''INSERT INTO dept_tasks (id, deptKey, title, assignedTo, priority, dueDate, status, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
            dept_seed
        )

# ====== CORS HEADERS MIDDLEWARE ======
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response

# ====== 1. OPERATIONAL 40-TASKS ENDPOINTS ======
@app.route('/api/operations/tasks', methods=['GET', 'POST', 'OPTIONS'])
def handle_tasks():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM tasks ORDER BY id ASC')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(rows)

    if request.method == 'POST':
        data = request.get_json() or {}
        # Bulk or single insert
        if isinstance(data, list):
            for t in data:
                cursor.execute('''
                    INSERT OR REPLACE INTO tasks (id, week, task, cat, status, responsible, dueDate, notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (t.get('id'), t.get('week', 1), t.get('task'), t.get('cat', 'تشغيلية'), t.get('status', 'pending'), t.get('responsible', 'علاء'), t.get('dueDate'), t.get('notes')))
            conn.commit()
            conn.close()
            return jsonify({'success': True, 'count': len(data)})
        else:
            task_id = data.get('id')
            if not task_id:
                cursor.execute('SELECT COALESCE(MAX(id), 0) + 1 FROM tasks')
                task_id = cursor.fetchone()[0]
            cursor.execute('''
                INSERT OR REPLACE INTO tasks (id, week, task, cat, status, responsible, dueDate, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (task_id, data.get('week', 1), data.get('task', ''), data.get('cat', 'تشغيلية'), data.get('status', 'pending'), data.get('responsible', 'علاء'), data.get('dueDate'), data.get('notes')))
            conn.commit()
            conn.close()
            return jsonify({'success': True, 'id': task_id})

@app.route('/api/operations/tasks/<int:task_id>', methods=['PUT', 'DELETE', 'OPTIONS'])
def handle_single_task(task_id):
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'PUT':
        data = request.get_json() or {}
        fields = []
        values = []
        for key in ['status', 'responsible', 'task', 'cat', 'week', 'dueDate', 'completedAt', 'notes']:
            if key in data:
                fields.append(f"{key} = ?")
                values.append(data[key])
        if fields:
            values.append(task_id)
            cursor.execute(f"UPDATE tasks SET {', '.join(fields)} WHERE id = ?", values)
            conn.commit()
        conn.close()
        return jsonify({'success': True, 'id': task_id})

    if request.method == 'DELETE':
        cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'deleted': task_id})

# ====== 2. CAFÉ BAR SHIFTS (AREF & ELEM) ENDPOINTS ======
@app.route('/api/sales/cafe', methods=['GET', 'POST', 'OPTIONS'])
def handle_cafe_sales():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM cafe_sales ORDER BY date DESC, id DESC')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(rows)

    if request.method == 'POST':
        data = request.get_json() or {}
        date_val = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        shift_val = data.get('shift', 'صباحي (عارف)')
        barista_val = data.get('barista', 'عارف')
        cups_val = int(data.get('cups', 0))
        desserts_val = int(data.get('desserts', 0))
        revenue_val = float(data.get('revenue', 0.0))
        tickets_val = int(data.get('tickets', 1))
        avg_ticket = round(revenue_val / max(tickets_val, 1), 2)
        notes_val = data.get('notes', '')
        created_at = datetime.now().isoformat()

        cursor.execute('''
            INSERT INTO cafe_sales (date, shift, barista, cups, desserts, revenue, tickets, avgTicket, notes, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (date_val, shift_val, barista_val, cups_val, desserts_val, revenue_val, tickets_val, avg_ticket, notes_val, created_at))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'id': new_id})

@app.route('/api/sales/cafe/<int:shift_id>', methods=['DELETE', 'OPTIONS'])
def delete_cafe_shift(shift_id):
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM cafe_sales WHERE id = ?', (shift_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'deleted': shift_id})

# ====== 3. ROASTERY PRODUCTION & B2B INVOICES ENDPOINTS ======
@app.route('/api/sales/roastery', methods=['GET', 'POST', 'OPTIONS'])
def handle_roastery_sales():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM roastery_sales ORDER BY date DESC, id DESC')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(rows)

    if request.method == 'POST':
        data = request.get_json() or {}
        date_val = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        client_val = data.get('client', 'عميل جملة جديد')
        roast_profile = data.get('roastProfile', 'بروفايل الحماصة الرائدة')
        green_kg = float(data.get('greenKg', 0.0))
        roasted_kg = float(data.get('roastedKg', 0.0))

        # Guardrail calculation for Roast Loss %
        if green_kg > 0:
            roast_loss_pct = round(((green_kg - roasted_kg) / green_kg) * 100, 2)
        else:
            roast_loss_pct = float(data.get('roastLossPct', 14.0))

        # Warning guardrail flag
        is_loss_warning = roast_loss_pct > 18.0

        price_per_kg = float(data.get('pricePerKg', 80.0))
        type_val = data.get('type', 'wholesale')
        paid_val = float(data.get('paid', roasted_kg * price_per_kg))
        pending_val = float(data.get('pending', 0.0))
        status_val = data.get('status', 'مكتمل')
        notes_val = data.get('notes', '')
        created_at = datetime.now().isoformat()

        cursor.execute('''
            INSERT INTO roastery_sales (date, client, roastProfile, greenKg, roastedKg, roastLossPct, pricePerKg, type, paid, pending, status, notes, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (date_val, client_val, roast_profile, green_kg, roasted_kg, roast_loss_pct, price_per_kg, type_val, paid_val, pending_val, status_val, notes_val, created_at))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({
            'success': True,
            'id': new_id,
            'roastLossPct': roast_loss_pct,
            'warning': is_loss_warning,
            'warningMessage': 'تنبيه حرج: نسبة فقد التحميص تجاوزت الحد المسموح (18%)' if is_loss_warning else None
        })

@app.route('/api/sales/roastery/<int:batch_id>', methods=['DELETE', 'OPTIONS'])
def delete_roastery_batch(batch_id):
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM roastery_sales WHERE id = ?', (batch_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'deleted': batch_id})

# ====== 4. WASTE TRACKING ENDPOINTS ======
@app.route('/api/operations/waste', methods=['GET', 'POST', 'OPTIONS'])
def handle_waste():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM waste_logs ORDER BY date DESC, id DESC')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(rows)

    if request.method == 'POST':
        data = request.get_json() or {}
        date_val = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        category_val = data.get('category', 'coffee')
        item_val = data.get('item', '')
        quantity_val = float(data.get('quantity', 0.0))
        unit_val = data.get('unit', 'كجم')
        cost_sar = float(data.get('costSAR', 0.0))
        reason_val = data.get('reason', '')
        reported_by = data.get('reportedBy', 'عارف')
        shift_val = data.get('shift', 'morning')
        created_at = datetime.now().isoformat()

        cursor.execute('''
            INSERT INTO waste_logs (date, category, item, quantity, unit, costSAR, reason, reportedBy, shift, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (date_val, category_val, item_val, quantity_val, unit_val, cost_sar, reason_val, reported_by, shift_val, created_at))
        new_id = cursor.lastrowid
        conn.commit()

        # Check total waste for this date to enforce daily guardrail (>100 SAR)
        cursor.execute('SELECT SUM(costSAR) FROM waste_logs WHERE date = ?', (date_val,))
        day_total = cursor.fetchone()[0] or 0.0
        exceeds_threshold = day_total > 100.0

        conn.close()
        return jsonify({
            'success': True,
            'id': new_id,
            'dayTotalCost': day_total,
            'warning': exceeds_threshold,
            'warningMessage': f'تنبيه مالي: تجاوز إجمالي الهدر اليومي الحد الآمن ({day_total:.2f} ر.س > 100 ر.س)' if exceeds_threshold else None
        })

@app.route('/api/operations/waste/<int:waste_id>', methods=['DELETE', 'OPTIONS'])
def delete_waste(waste_id):
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM waste_logs WHERE id = ?', (waste_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'deleted': waste_id})

# ====== 5. MENU ENGINEERING & MARGINS ENDPOINTS ======
@app.route('/api/operations/menu', methods=['GET', 'POST', 'OPTIONS'])
def handle_menu():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM menu_items ORDER BY price DESC')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(rows)

    if request.method == 'POST':
        data = request.get_json() or {}
        name = data.get('name', 'صنف جديد')
        cat = data.get('category', 'مشروبات ساخنة')
        price = float(data.get('price', 15.0))
        cost = float(data.get('cost', 4.0))
        popularity = int(data.get('popularity', 7))

        # Automatic 2D matrix classification
        contrib_margin = price - cost
        high_contrib = contrib_margin >= 10.0
        high_pop = popularity >= 7

        if high_contrib and high_pop:
            class_type, label, badge, icon = 'stars', 'نجم (Star)', 'badge-green', 'fa-star'
        elif not high_contrib and high_pop:
            class_type, label, badge, icon = 'plowhorses', 'حصان (Plowhorse)', 'badge-warning', 'fa-horse'
        elif high_contrib and not high_pop:
            class_type, label, badge, icon = 'puzzles', 'لغز (Puzzle)', 'badge-blue', 'fa-circle-question'
        else:
            class_type, label, badge, icon = 'dogs', 'منخفض (Dog)', 'badge-danger', 'fa-paw'

        cursor.execute('''
            INSERT INTO menu_items (name, category, price, cost, popularity, classType, label, badge, icon)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, cat, price, cost, popularity, class_type, label, badge, icon))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'id': new_id})

@app.route('/api/operations/menu/<int:item_id>', methods=['PUT', 'DELETE', 'OPTIONS'])
def handle_menu_item(item_id):
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'PUT':
        data = request.get_json() or {}
        price = float(data.get('price', 15.0))
        cost = float(data.get('cost', 4.0))
        pop = int(data.get('popularity', 7))
        contrib = price - cost
        high_c = contrib >= 10.0
        high_p = pop >= 7

        if high_c and high_p:
            c_type, label, badge, icon = 'stars', 'نجم (Star)', 'badge-green', 'fa-star'
        elif not high_c and high_p:
            c_type, label, badge, icon = 'plowhorses', 'حصان (Plowhorse)', 'badge-warning', 'fa-horse'
        elif high_c and not high_p:
            c_type, label, badge, icon = 'puzzles', 'لغز (Puzzle)', 'badge-blue', 'fa-circle-question'
        else:
            c_type, label, badge, icon = 'dogs', 'منخفض (Dog)', 'badge-danger', 'fa-paw'

        cursor.execute('''
            UPDATE menu_items SET name=?, category=?, price=?, cost=?, popularity=?, classType=?, label=?, badge=?, icon=?
            WHERE id=?
        ''', (data.get('name'), data.get('category'), price, cost, pop, c_type, label, badge, icon, item_id))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'id': item_id})

    if request.method == 'DELETE':
        cursor.execute('DELETE FROM menu_items WHERE id=?', (item_id,))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'deleted': item_id})

# ====== 6. FINANCIAL COMMITMENTS ENDPOINTS ======
@app.route('/api/operations/financials', methods=['GET', 'POST', 'OPTIONS'])
def handle_financials():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM financial_commitments ORDER BY dueDate ASC')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(rows)

    if request.method == 'POST':
        data = request.get_json() or {}
        cursor.execute('''
            INSERT INTO financial_commitments (title, amount, dueDate, paymentMethod, status, type)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (data.get('title'), float(data.get('amount', 0)), data.get('dueDate'), data.get('paymentMethod', 'تحويل'), data.get('status', 'pending'), data.get('type', 'fixed')))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'id': new_id})

# ====== 7. DEPARTMENT TASKS ENDPOINTS ======
@app.route('/api/operations/dept_tasks', methods=['GET', 'POST', 'OPTIONS'])
def handle_dept_tasks():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        dept_filter = request.args.get('deptKey')
        if dept_filter:
            cursor.execute('SELECT * FROM dept_tasks WHERE deptKey = ? ORDER BY createdAt DESC', (dept_filter,))
        else:
            cursor.execute('SELECT * FROM dept_tasks ORDER BY createdAt DESC')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(rows)

    if request.method == 'POST':
        data = request.get_json() or {}
        task_id = data.get('id', f"dt-{int(datetime.now().timestamp()*1000)}")
        cursor.execute('''
            INSERT OR REPLACE INTO dept_tasks (id, deptKey, title, assignedTo, priority, dueDate, status, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (task_id, data.get('deptKey'), data.get('title'), data.get('assignedTo', 'غير مسند'), data.get('priority', 'medium'), data.get('dueDate'), data.get('status', 'pending'), datetime.now().isoformat()))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'id': task_id})

@app.route('/api/operations/dept_tasks/<string:task_id>', methods=['PUT', 'DELETE', 'OPTIONS'])
def handle_single_dept_task(task_id):
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'PUT':
        data = request.get_json() or {}
        cursor.execute('UPDATE dept_tasks SET status=? WHERE id=?', (data.get('status', 'completed'), task_id))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'id': task_id})

    if request.method == 'DELETE':
        cursor.execute('DELETE FROM dept_tasks WHERE id=?', (task_id,))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'deleted': task_id})

# ====== 8. ORG STRUCTURE ENDPOINTS ======
@app.route('/api/operations/org_structure', methods=['GET', 'POST', 'OPTIONS'])
def handle_org_structure():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM org_roles')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({'roles': rows})

    if request.method == 'POST':
        data = request.get_json() or {}
        roles = data.get('roles', [])
        cursor.execute('DELETE FROM org_roles')
        for r in roles:
            cursor.execute('''
                INSERT INTO org_roles (id, holder, startDate, salary, assignedAt)
                VALUES (?, ?, ?, ?, ?)
            ''', (r.get('id'), r.get('holder'), r.get('startDate'), int(r.get('salary', 5000)), r.get('assignedAt', datetime.now().isoformat())))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'count': len(roles)})

# ====== 9. DEV PIPELINE ENDPOINTS ======
@app.route('/api/operations/dev_pipeline', methods=['GET', 'POST', 'OPTIONS'])
def handle_dev_pipeline():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM dev_pipeline ORDER BY id ASC')
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(rows)

    if request.method == 'POST':
        data = request.get_json() or {}
        cursor.execute('''
            INSERT INTO dev_pipeline (category, title, description, progressPct, owner, targetDate, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (data.get('category', 'training'), data.get('title'), data.get('description'), int(data.get('progressPct', 0)), data.get('owner', 'علاء'), data.get('targetDate'), data.get('status', 'in-progress')))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'id': new_id})

# ====== 10. ONE-CLICK BACKUP & RESTORE UTILITY ======
@app.route('/api/system/backup', methods=['GET', 'POST', 'OPTIONS'])
def handle_backup():
    if request.method == 'OPTIONS':
        return jsonify({'ok': True})
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        # Export all tables to a clean JSON snapshot
        tables = ['tasks', 'cafe_sales', 'roastery_sales', 'waste_logs', 'menu_items', 'dept_tasks', 'org_roles', 'financial_commitments', 'dev_pipeline']
        dump = {
            'metadata': {
                'system': 'RoR Operation System',
                'version': '2.4.0-PROD',
                'exportedAt': datetime.now().isoformat()
            },
            'data': {}
        }
        for t in tables:
            cursor.execute(f"SELECT * FROM {t}")
            dump['data'][t] = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return jsonify(dump)

    if request.method == 'POST':
        # Restore JSON snapshot into SQLite
        payload = request.get_json() or {}
        data = payload.get('data', {})
        if not data:
            return jsonify({'success': False, 'error': 'Invalid backup format'}), 400

        try:
            for table_name, rows in data.items():
                if rows and isinstance(rows, list):
                    # Clear and reinsert
                    cursor.execute(f"DELETE FROM {table_name}")
                    cols = rows[0].keys()
                    placeholders = ', '.join(['?'] * len(cols))
                    col_names = ', '.join(cols)
                    insert_sql = f"INSERT INTO {table_name} ({col_names}) VALUES ({placeholders})"
                    for row in rows:
                        cursor.execute(insert_sql, [row[c] for c in cols])
            conn.commit()
            conn.close()
            return jsonify({'success': True, 'message': 'System restored successfully'})
        except Exception as e:
            conn.rollback()
            conn.close()
            return jsonify({'success': False, 'error': str(e)}), 500

# ====== FRONTEND STATIC FILE SERVING ======
@app.route('/')
def serve_index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(BASE_DIR, path)):
        return send_from_directory(BASE_DIR, path)
    return send_from_directory(BASE_DIR, 'index.html')

# ====== SERVER ENTRY POINT ======
if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5001))
    print(f"[*] Starting RoR Enterprise Server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
