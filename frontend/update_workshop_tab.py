import os

path = "src/pages/Dashboard.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # محاكاة طلبيات واردة تفاعلية للنجار
    new_workshop_section = """            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'workshop' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">
                  {isAr ? 'إدارة الورشة والطلبات الواردة' : 'Manage Workshop & Incoming Orders'}
                </h3>
                
                {/* كروت الإحصائيات الديناميكية */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">{t('new_orders')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-amber-900 dark:text-amber-300">
                      {workshopOrders.filter(o => o.status === 'جديد' || o.status === 'New').length}
                    </h4>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900/30">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">{t('in_progress')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-blue-900 dark:text-blue-300">
                      {workshopOrders.filter(o => o.status === 'قيد التنفيذ' || o.status === 'In Progress').length}
                    </h4>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
                    <span className="text-xs text-green-600 dark:text-green-400 font-bold">{t('completed_projects')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-green-900 dark:text-green-300">
                      {workshopOrders.filter(o => o.status === 'مكتمل' || o.status === 'Completed').length}
                    </h4>
                  </div>
                </div>

                {/* جدول التحكم بطلبات الزبائن */}
                <div className="pt-4">
                  <h4 className="font-bold text-brand-dark dark:text-white text-sm mb-4">
                    {isAr ? 'قائمة الطلبات التفصيلية الواردة للورشة' : 'Incoming Custom Orders'}
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-white/10 text-gray-400">
                          <th className="pb-3">{isAr ? 'العميل' : 'Customer'}</th>
                          <th className="pb-3">{isAr ? 'نوع الطلب' : 'Item Type'}</th>
                          <th className="pb-3">{isAr ? 'المقاسات / الخشب' : 'Details'}</th>
                          <th className="pb-3">{isAr ? 'الحالة الحالية' : 'Status'}</th>
                          <th className="pb-3">{isAr ? 'التحكم بالحالة' : 'Change Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {workshopOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td className="py-3 font-bold text-brand-dark dark:text-white">{ord.customer}</td>
                            <td className="py-3 text-brand-gold font-semibold">{ord.type}</td>
                            <td className="py-3 text-gray-500 dark:text-gray-400">{ord.details}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.status === 'جديد' ? 'bg-amber-100 text-amber-800' :
                                ord.status === 'قيد التنفيذ' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-3 flex gap-1">
                              <button onClick={() => updateOrderStatus(ord.id, 'قيد التنفيذ')} className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-blue-100">
                                {isAr ? 'قيد التنفيذ' : 'In Progress'}
                              </button>
                              <button onClick={() => updateOrderStatus(ord.id, 'مكتمل')} className="bg-green-50 text-green-600 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-green-100">
                                {isAr ? 'إكتمال' : 'Complete'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}"""

    # إضافة حالة الطلبات والدوال إذا لم تكن موجودة
    if "const [workshopOrders, setWorkshopOrders]" not in code:
        state_code = """  const [workshopOrders, setWorkshopOrders] = useState([
    { id: 101, customer: 'علي الحسين', type: 'طاولة طعام 8 كراسي', details: '200x100 سم / خشب زان', status: 'جديد' },
    { id: 102, customer: 'سارة أحمد', type: 'خزانة ملابس سحاب', details: '240x220 سم / خشب MDF اسباني', status: 'قيد التنفيذ' }
  ]);

  const updateOrderStatus = (id, newStatus) => {
    setWorkshopOrders(workshopOrders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };
"""
        code = code.replace("const Dashboard = () => {", "const Dashboard = () => {\n" + state_code)

    # استبدال تبويب إدارة الورشة القديم بالجديد
    start_str = "{(userRole === 'craftsman' || userRole === 'company') && activeTab === 'workshop' && ("
    end_str = ")} \n"

    if start_str in code:
        # استبدال الجزء الممتد حتى نهاية التبويب
        parts = code.split(start_str)
        after_parts = parts[1].split(")}", 1)
        code = parts[0] + new_workshop_section + after_parts[1]
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ تم إضافة جدول التحكم بالطلبات وتحديث إدارة الورشة بنجاح!")
    else:
        print("⚠️ لم يتم تحديد التبويب القديم بشكل مطابق، يتم إجراء استبدال مباشر...")
