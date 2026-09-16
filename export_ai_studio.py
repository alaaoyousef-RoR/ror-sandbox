#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RoR Enterprise Suite - Google AI Studio Prompt & Data Exporter
Extracts schema and active operational data from ror_system.db and compiles
a production-grade prompt package optimized for Google AI Studio (aistudio.google.com).
"""

import os
import json
import sqlite3
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'ror_system.db')
OUTPUT_MD = os.path.join(BASE_DIR, 'google_ai_studio_prompt.md')
OUTPUT_JSON = os.path.join(BASE_DIR, 'google_ai_studio_bundle.json')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def extract_database():
    conn = get_db()
    cursor = conn.cursor()

    tables = [
        'tasks', 'cafe_sales', 'roastery_sales', 'waste_logs', 
        'menu_items', 'dept_tasks', 'financial_commitments', 'dev_pipeline'
    ]

    schema = {}
    data = {}

    for table in tables:
        cursor.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{table}'")
        row = cursor.fetchone()
        schema[table] = row[0] if row else ""

        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        data[table] = [dict(r) for r in rows]

    conn.close()
    return schema, data

def calculate_summary_kpis(data):
    cafe_rev = sum(float(r.get('revenue', 0)) for r in data.get('cafe_sales', []))
    cafe_cups = sum(int(r.get('cups', 0)) for r in data.get('cafe_sales', []))
    cafe_tickets = sum(int(r.get('tickets', 0)) for r in data.get('cafe_sales', []))

    roast_rev = sum(float(r.get('paid', 0)) for r in data.get('roastery_sales', []))
    roast_pending = sum(float(r.get('pending', 0)) for r in data.get('roastery_sales', []))
    roast_green_kg = sum(float(r.get('greenKg', 0)) for r in data.get('roastery_sales', []))
    roast_roasted_kg = sum(float(r.get('roastedKg', 0)) for r in data.get('roastery_sales', []))
    overall_loss_pct = ((roast_green_kg - roast_roasted_kg) / roast_green_kg * 100) if roast_green_kg > 0 else 0

    total_waste_sar = sum(float(r.get('costSAR', 0)) for r in data.get('waste_logs', []))
    fixed_commitments_sar = sum(float(r.get('amount', 0)) for r in data.get('financial_commitments', []) if r.get('type') == 'fixed')

    return {
        'total_cafe_revenue': cafe_rev,
        'total_cafe_cups': cafe_cups,
        'total_cafe_tickets': cafe_tickets,
        'total_roastery_collected': roast_rev,
        'total_roastery_pending': roast_pending,
        'total_green_coffee_kg': roast_green_kg,
        'total_roasted_coffee_kg': roast_roasted_kg,
        'average_roast_loss_pct': round(overall_loss_pct, 2),
        'total_waste_sar': round(total_waste_sar, 2),
        'total_fixed_commitments_sar': fixed_commitments_sar,
        'total_combined_revenue': cafe_rev + roast_rev
    }

def build_system_instructions():
    return """أنت كبير المستشارين الماليين والتشغيليين وخبير التحميص المتخصص (Senior Coffee Operations & Financial Intelligence Consultant) لمشروع «RoR Speciality Coffee & Roastery».

### 1. نطاق ومهمة النظام (System Scope & Mission)
مهمتك تقديم تحليلات تشغيلية ومالية تنفيذية دقيقة مبنية بالكامل على بيانات قاعدة بيانات النظام المرفقة، وتشخيص كفاءة الفرع والمحمصة، وكشف الانحرافات، واقتراح خطوات عملية فورية وقابلة للتطبيق لزيادة الربحية وضبط التكاليف.

### 2. القواعد والمحددات التشغيلية الحاكمة لـ RoR (Operational Guardrails)
1. **معيار نسبة فاقد التحميص (Roast Loss % Guardrail):**
   - المعادلة: `((الوزن الأخضر - الوزن المحمص) / الوزن الأخضر) * 100`
   - النطاق القياسي الآمن للمحاصيل المختصة: **12.0% إلى 18.0%**.
   - أي دفعة يقل فاقدها عن 12% تعد (Under-developed / رطوبة متبقية زائدة).
   - أي دفعة يتجاوز فاقدها 18% تعد شذوذاً تشغيلياً (Over-roasted / هدر غير مبرر في وزن المحصول) يستوجب التنبيه الفوري.
2. **سقف الهدر اليومي (Daily Waste Threshold):**
   - السقف الأقصى المسموح به للهدر اليومي هو **100 ريال سعودي**.
   - أي يوم يتجاوز إجمالي الهدر فيه 100 ر.س يجب تصنيفه كإنذار تشغيلي أحمر مع تحديد المصدر (الحليب، البن، الحلى، أو انتهاء الصلاحية) وتوصية بمساءلة الوردية المعنية.
3. **أرضية التكلفة اليومية ونقطة التعادل (Daily Cost Floor & Break-Even):**
   - نقطة التعادل الشهرية = `المصاريف الثابتة / (1 - نسبة التكاليف المتغيرة)`.
   - أرضية التكلفة اليومية = `نقطة التعادل الشهرية / 30 يوم`.
   - يجب مقارنة إجمالي مبيعات اليوم (البار + المحمصة) بهذه الأرضية لتحديد هل حقق اليوم فائضاً تشغيلياً أم عجزاً.
4. **مصفوفة هندسة المنيو (Menu Engineering 4-Box Matrix):**
   - **النجوم (Stars):** ربحية عالية + شعبية عالية -> تثبيت المعايير والحفاظ على الجودة والتسويق.
   - **فرس الرهان (Plowhorses):** ربحية منخفضة + شعبية عالية -> تحسين التكلفة (Re-costing) أو رفع السعر بهامش طفيف.
   - **الألغاز (Puzzles):** ربحية عالية + شعبية منخفضة -> تعزيز الظهور واقتراح المشروب من الباريستا.
   - **الأعباء (Dogs):** ربحية منخفضة + شعبية منخفضة -> إعادة هيكلة أو استبدال فوري.

### 3. أسلوب الصياغة والعرض (Output Format Guidelines)
- اللغة: لغة عربية مهنية استشارية تنفيذية راقية ومباشرة (Business Arabic).
- التنسيق: استخدام الجداول المقارنة (Markdown Tables)، النقاط المحددة، والعناوين الواضحة.
- الأرقام: استخدام الأرقام الغربية اللاتينية دائماً (0, 1, 2, ... 9) متبوعة برمز العملة (ر.س) أو الوحدة.
- التوصيات: تقسيم المخرجات دائماً إلى:
  1. ملخص تشخيصي سريع (Executive Summary).
  2. مؤشرات الأداء والتباينات (Variance & KPI Analysis).
  3. التنبيهات والانحرافات الخطرة (Critical Flags & Guardrail Violations).
  4. خطة العمل المباشرة بالأولويات (Immediate Action Plan - 24h / 7 Days)."""

def generate_markdown_prompt(schema, data, kpis):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    content = f"""# دليل واستمارة إطلاق RoR في Google AI Studio
**التاريخ والتحديث:** {timestamp}  
**المنصة:** Google AI Studio ([aistudio.google.com](https://aistudio.google.com/))  
**النموذج الموصى به:** `Gemini 2.5 Pro` أو `Gemini 2.5 Flash`

---

## 📋 طريقة الاستخدام السريعة في Google AI Studio:
1. افتح موقع **[Google AI Studio](https://aistudio.google.com/)** وسجّل دخولك.
2. اضغط على **"Create new prompt"** -> اختر **"Chat prompt"** أو **"System Instructions"**.
3. انسخ محتوى **القسم الأول (System Instructions)** وضعه في خانة `System Instructions` المخصصة في أعلى لوحة AI Studio.
4. انسخ محتوى **القسم الثاني (Database Schema & Context Data)** وضعه في بداية محادثتك أو في صندوق `User Input` كبيانات مرجعية.
5. اختر واحداً من **النماذج التوجيهية الجاهزة (القسم الثالث)** لتوجيهه للنموذج وسيقوم بالتحليل الفوري بدقة واحترافية.

---

# [القسم الأول]: إرشادات النظام (System Instructions)
> **انسخ هذا النص وضعه داخل خانة "System Instructions" في Google AI Studio:**

```text
{build_system_instructions()}
```

---

# [القسم الثاني]: هيكل البيانات وسجلات النظام الحية (Data & Schema Context)
> **انسخ هذا النص وضعه في أول رسالة مع النموذج لتزويده بالبيانات الكاملة:**

```markdown
### 1. ملخص مؤشرات الأداء اللحظية (Executive Snapshot):
- إجمالي مبيعات المقهى (البار): {kpis['total_cafe_revenue']:,.2f} ر.س ({kpis['total_cafe_cups']} كوب / {kpis['total_cafe_tickets']} فاتورة)
- إجمالي مبيعات المحمصة المحصلة: {kpis['total_roastery_collected']:,.2f} ر.س (المبالغ المعلقة: {kpis['total_roastery_pending']:,.2f} ر.س)
- إجمالي الإيراد التشغيلي الموحد: {kpis['total_combined_revenue']:,.2f} ر.س
- إجمالي كمية البن الأخضر المحمص: {kpis['total_green_coffee_kg']} كجم -> بن محمص جاهز: {kpis['total_roasted_coffee_kg']} كجم
- متوسط نسبة فاقد التحميص العام: {kpis['average_roast_loss_pct']}%
- إجمالي تكلفة الهدر المسجل: {kpis['total_waste_sar']:,.2f} ر.س
- الالتزامات المالية الثابتة المجدولة: {kpis['total_fixed_commitments_sar']:,.2f} ر.س

### 2. مخطط قاعدة البيانات (Database Schema - DDL):
```sql
"""
    for table_name, ddl in schema.items():
        content += f"-- Table: {table_name}\n{ddl.strip()}\n\n"

    content += """```

### 3. جداول البيانات التشغيلية الكاملة (Live Database Records):

"""
    # 1. Cafe Sales
    content += "#### أ. مبيعات البار اليومية (cafe_sales):\n"
    content += "| المعرف | التاريخ | الوردية | الباريستا | الأكواب | الحلى | الإيراد (ر.س) | الفواتير | متوسط الفاتورة |\n"
    content += "|---|---|---|---|---|---|---|---|---|\n"
    for r in data.get('cafe_sales', []):
        content += f"| {r['id']} | {r['date']} | {r['shift']} | {r['barista']} | {r['cups']} | {r['desserts']} | {r['revenue']} | {r['tickets']} | {r['avgTicket']} |\n"

    # 2. Roastery Sales
    content += "\n#### ب. تشغيل المحمصة والـ B2B (roastery_sales):\n"
    content += "| المعرف | التاريخ | العميل / القناة | المحصول / البروفايل | أخضر (كجم) | محمص (كجم) | الفاقد % | السعر/كجم | النوع | المحصل | المتبقي | الحالة |\n"
    content += "|---|---|---|---|---|---|---|---|---|---|---|---|\n"
    for r in data.get('roastery_sales', []):
        content += f"| {r['id']} | {r['date']} | {r['client']} | {r['roastProfile']} | {r['greenKg']} | {r['roastedKg']} | {r['roastLossPct']}% | {r['pricePerKg']} | {r['type']} | {r['paid']} | {r['pending']} | {r['status']} |\n"

    # 3. Waste Logs
    content += "\n#### ج. سجلات الهدر والتالف (waste_logs):\n"
    content += "| المعرف | التاريخ | الصنف | التصنيف | الكمية | الوحدة | التكلفة (ر.س) | سبب الهدر | المسؤول | الوردية |\n"
    content += "|---|---|---|---|---|---|---|---|---|---|\n"
    for r in data.get('waste_logs', []):
        content += f"| {r['id']} | {r['date']} | {r['item']} | {r['category']} | {r['quantity']} | {r['unit']} | {r['costSAR']} | {r['reason']} | {r['reportedBy']} | {r['shift']} |\n"

    # 4. Menu Engineering
    content += "\n#### د. مصفوفة المنيو والتسعير (menu_items):\n"
    content += "| الصنف | التصنيف | سعر البيع (ر.س) | التكلفة (ر.س) | هامش المساهمة | نسبة الهامش % | الشعبية (شهرياً) | التصنيف الاستراتيجي |\n"
    content += "|---|---|---|---|---|---|---|---|\n"
    for r in data.get('menu_items', []):
        margin = r['price'] - r['cost']
        margin_pct = round((margin / r['price']) * 100, 1) if r['price'] > 0 else 0
        content += f"| {r['name']} | {r['category']} | {r['price']} | {r['cost']} | {margin:.2f} | {margin_pct}% | {r['popularity']} | {r['label']} ({r['classType']}) |\n"

    # 5. Financial Commitments
    content += "\n#### هـ. الالتزامات المالية والمصروفات الثابتة (financial_commitments):\n"
    content += "| البند | المبلغ (ر.س) | تاريخ الاستحقاق | طريقة السداد | الحالة | النوع |\n"
    content += "|---|---|---|---|---|---|\n"
    for r in data.get('financial_commitments', []):
        content += f"| {r['title']} | {r['amount']} | {r['dueDate']} | {r['paymentMethod']} | {r['status']} | {r['type']} |\n"

    # 6. Operational Tasks & Development Pipeline
    content += "\n#### و. خطة المهام التشغيلية ومسار التطوير (Operational Tasks & Roadmap):\n"
    content += "| الرمز | المبادرة / المهمة | المسؤول | الأولوية / الإنجاز | الحالة |\n"
    content += "|---|---|---|---|---|\n"
    for r in data.get('dept_tasks', []):
        content += f"| {r['id']} | {r['title']} | {r['assignedTo']} | {r['priority']} | {r['status']} |\n"
    for r in data.get('dev_pipeline', []):
        content += f"| dev_{r['id']} | {r['title']} | {r['owner']} | إنجاز {r['progressPct']}% | {r['status']} |\n"

    content += """```

---

# [القسم الثالث]: نماذج الأسئلة والتحليلات الجاهزة (Ready-to-Use Prompts)
> **انسخ أي سؤال من الأسئلة التالية وأرسله إلى النموذج للحصول على دراسة فورية:**

### 🔍 السؤال الأول: التدقيق المالي والتشغيلي الشامل (Comprehensive Business Audit)
```text
بصفتك كبير المستشارين الماليين والتشغيليين لـ RoR، وبناءً على كافة البيانات وسجلات المبيعات والمصروفات المرفقة أعلاه:
1. قدم تحليلاً شاملاً لأداء المقهى والمحمصة، وحدد قنوات الدخل الأعلى ربحية والأكثر استقراراً.
2. قارن بين مبيعات وردية الصباح (عارف) ووردية المساء (إيلم) من حيث متوسط الفاتورة وعدد الأكواب ومعدل التحويل لحلى.
3. هل الإيرادات الحالية تغطي أرضية التكاليف التشغيلية ونقطة التعادل؟ وضح نسبة الفائض أو العجز.
4. زود الإدارة بخمس توصيات تنفيذية ذات أولوية قصوى للأسبوع القادم.
```

### ☕ السؤال الثاني: تشخيص كفاءة التحميص ونسبة الفاقد (Roastery Yield & Roast Loss Diagnostics)
```text
راجع سجلات تشغيل المحمصة (roastery_sales) بدقة:
1. هل تتوافق جميع دفعات التحميص مع معيار RoR الحاكم لنسبة الفاقد (12% - 18%)؟ حدد أي تشغيل يخالف هذا المعيار واشرح دلالته الفنية.
2. قارن بين ربحية بيع المحاصيل كحبوب مجهزة للمقاهي B2B وبين تعبئتها كأرباع 250جم للرف أو المتجر الإلكتروني من حيث هامش الربح لكل كجم وتكلفة التغليف المترتبة.
3. ما هي خطة العمل الفنية لتقليل هدر التحميص وتحسين كفاءة الحماصة الأساسية (جيسن 15كجم)؟
```

### 🗑️ السؤال الثالث: تحليل الهدر والإجراءات التصحيحية (Waste Audit & Action Plan)
```text
قم بتدقيق سجلات الهدر والتالف (waste_logs) ومقارنتها بسقف الهدر اليومي (100 ر.س):
1. صنف الهدر حسب الفئات (حليب، بن، حلى) وحدد الفئة الأكثر استنزافاً للأموال.
2. هل تم تجاوز سقف الهدر في أي من التواريخ المسجلة؟ وما هي الأسباب الجذرية وراء ذلك؟
3. ضع بروتوكولاً قياسياً موحداً (SOP) للباريستا والمطبخ للحد من هدر تبخير الحليب وتلف الأطعمة السريعة.
```

### 🍰 السؤال الرابع: مصفوفة هندسة المنيو واستراتيجية التسعير (Menu Matrix Optimization)
```text
استناداً إلى بيانات جدول (menu_items) المصنفة وفق مصفوفة بوسطن (Stars, Plowhorses, Puzzles, Dogs):
1. ما هي المنتجات التي تعتبر "فرس رهان" وكيف يمكن تحسين هوامش ربحيتها دون التأثير سلباً على المبيعات؟
2. ما هي المنتجات المصنفة كـ "ألغاز" وما هي الخطة الترويجية المقترحة للباريستا لرفع مبيعاتها؟
3. هل يوجد أصناف يجب إزالتها فوراً من المنيو؟
```

### 📈 السؤال الخامس: التدفقات النقدية وتحصيل مستحقات الـ B2B (Cash Flow & Receivables)
```text
حلل المبالغ المحصلة والمبالغ المتبقية في جدول roastery_sales مقابل الالتزامات المالية المستحقة في financial_commitments:
1. ما هو حجم السيولة المعلقة لدى العملاء (Pending Receivables) وما مدى خطورتها على التدفق النقدي؟
2. ضع جدولاً زمنياً مقترحاً لتحصيل الديون وجدول سداد الالتزامات الثابتة (الإيجار، التأمينات، اشتراكات الأنظمة) لتفادي أي عجز سيولة.
```
"""
    return content

def generate_bundle_json(schema, data, kpis):
    bundle = {
        'system_instructions': build_system_instructions(),
        'metadata': {
            'exported_at': datetime.now().isoformat(),
            'platform': 'Google AI Studio',
            'recommended_models': ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-1.5-pro'],
            'kpi_summary': kpis
        },
        'schema': schema,
        'data': data,
        'sample_prompts': [
            {
                'id': 'comprehensive_audit',
                'title': 'التدقيق المالي والتشغيلي الشامل',
                'prompt': 'بصفتك كبير المستشارين الماليين والتشغيليين لـ RoR، قدم تحليلاً شاملاً لأداء المقهى والمحمصة بناءً على البيانات المرفقة...'
            },
            {
                'id': 'roast_loss_diagnostics',
                'title': 'تشخيص كفاءة التحميص ونسبة الفاقد',
                'prompt': 'راجع سجلات تشغيل المحمصة (roastery_sales) بدقة وتأكد من مطابقة نسبة الفاقد للمعيار 12%-18%...'
            },
            {
                'id': 'waste_audit',
                'title': 'تحليل الهدر والإجراءات التصحيحية',
                'prompt': 'قم بتدقيق سجلات الهدر والتالف ومقارنتها بسقف الهدر اليومي (100 ر.س)...'
            },
            {
                'id': 'menu_engineering',
                'title': 'مصفوفة هندسة المنيو واستراتيجية التسعير',
                'prompt': 'استناداً إلى بيانات جدول menu_items، حدد كيفية تحسين هوامش ربحية فرس الرهان والتعامل مع الألغاز والأعباء...'
            },
            {
                'id': 'cash_flow_receivables',
                'title': 'التدفقات النقدية وتحصيل مستحقات الـ B2B',
                'prompt': 'حلل المبالغ المحصلة والمتبقية في جدول roastery_sales مقابل الالتزامات المالية المستحقة...'
            }
        ]
    }
    return json.dumps(bundle, ensure_ascii=False, indent=2)

def main():
    print(f"Connecting to database: {DB_PATH}")
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Database not found at {DB_PATH}")

    schema, data = extract_database()
    kpis = calculate_summary_kpis(data)

    print("Generating Google AI Studio Markdown prompt...")
    md_content = generate_markdown_prompt(schema, data, kpis)
    with open(OUTPUT_MD, 'w', encoding='utf-8') as f:
        f.write(md_content)
    print(f"-> Saved: {OUTPUT_MD} ({len(md_content)} bytes)")

    print("Generating Google AI Studio JSON bundle...")
    json_content = generate_bundle_json(schema, data, kpis)
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        f.write(json_content)
    print(f"-> Saved: {OUTPUT_JSON} ({len(json_content)} bytes)")

    print("\nSummary of Extracted Records:")
    for tbl, rows in data.items():
        print(f"  - {tbl}: {len(rows)} rows")
    print(f"  - Combined Revenue: {kpis['total_combined_revenue']:,.2f} SAR")
    print(f"  - Avg Roast Loss: {kpis['average_roast_loss_pct']}%")
    print("\n[SUCCESS] Google AI Studio export files generated successfully.")

if __name__ == '__main__':
    main()
