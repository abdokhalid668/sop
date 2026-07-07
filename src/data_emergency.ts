import { SOP } from './types';

export const EMERGENCY_SOPS: SOP[] = [
  {
    sop_code: "DRI-EME-201",
    category: "emergency",
    title_en: "Unattended Items",
    title_ar: "عناصر/أشياء مفقودة أو مشتبه بها",
    reference_documents: ["RATP Dev Cairo Disaster Management Plan Section 3", "SOPs DRI - Emergency booklet Page 6"],
    metadata: {
      "P1": {
        "type": "point_of_attention",
        "text_ar": "ينبغي تنفيذ تقييم HOT Assessment فقط من قبل موظفين مؤهلين. ضابط الشرطة/طاقم الأمن هو الشخص الوحيد المصرح له بالإعلان عن العنصر المفقود أنه مشتبه به.",
        "text_en": "HOT Assessment must only be done by qualified staff. Transit police/security is the sole authority to declare an item suspicious."
      },
      "P2": {
        "type": "point_of_attention",
        "text_ar": "معايير تقييم HOT: H (مخفي Hidden)، O (مشتبه به Obvious)، T (غير معتاد وجوده Typical).",
        "text_en": "HOT criteria: H (Hidden), O (Obvious), T (Typical)."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "تم الإبلاغ عن وجود عنصر مفقود داخل القطار من قبل أحد الركاب أو أثناء جولة تفتيشية",
        "text_en": "Report of an unattended item inside the train received from a passenger or during inspection.",
        "next": "action_collect_info"
      },
      "action_collect_info": {
        "type": "action",
        "text_ar": "قم بجمع أكبر قدر ممكن من المعلومات حول العنصر المفقود ومواصفاته وموقعه بالتحديد من الشخص المبلغ",
        "text_en": "Collect as much information as possible about the item, its description, and precise location from the reporter.",
        "next": "action_check_cctv"
      },
      "action_check_cctv": {
        "type": "action",
        "text_ar": "قم بمراجعة كاميرات CCTV على متن القطار في أقرب فرصة لتأكيد وجود وموقع العنصر المفقود بصرياً",
        "text_en": "Review on-board CCTV cameras at the earliest opportunity to visually confirm the item's presence and location.",
        "next": "action_notify_occ_unattended"
      },
      "action_notify_occ_unattended": {
        "type": "action",
        "text_ar": "قم بإبلاغ مركز التحكم المركزي OCC فوراً وتزويدهم بجميع المعلومات والوصف المتاح للعنصر",
        "text_en": "Immediately notify OCC and provide them with all available information and descriptions of the item.",
        "next": "q_is_at_station"
      },
      "q_is_at_station": {
        "type": "question",
        "text_ar": "هل يتواجد القطار حالياً بداخل المحطة ومحاذياً للرصيف؟",
        "text_en": "Is the train currently stopped at the station platform?",
        "yes": "action_broadcast_pa_unattended",
        "no": "action_proceed_next_station"
      },
      "action_proceed_next_station": {
        "type": "action",
        "text_ar": "توجه إلى المحطة التالية إن أمكن، ثم قم بإيقاف القطار في المكان المخصص له بالمحطة وافتح الأبواب",
        "text_en": "Proceed to the next station if possible, stop the train at the designated spot, and open passenger doors.",
        "next": "action_broadcast_pa_unattended"
      },
      "action_broadcast_pa_unattended": {
        "type": "action",
        "text_ar": "قم بإصدار إذاعة عامة على الركاب للمطالبة بترك العنصر المفقود وتوجيههم حتى تدخل طاقم الأمن / موظفي المحطة",
        "text_en": "Broadcast a PA announcement to passengers to stay clear of the item and guide them until station staff/security arrives.",
        "next": "action_coordinate_hot"
      },
      "action_coordinate_hot": {
        "type": "action",
        "text_ar": "قم بالتنسيق مع موظفي المحطة والأمن لإجراء تقييم سريع (HOT Assessment) والتحقق من سلامة الوضع",
        "text_en": "Coordinate with station staff and security to conduct a rapid HOT Assessment and verify safety.",
        "linked_metadata": ["P1", "P2"],
        "next": "action_report_occ_outcome"
      },
      "action_report_occ_outcome": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم OCC بنتيجة التقييم والقرارات الأمنية المعتمدة بخصوص القطار واستأنف المسير وفق التوجيهات",
        "text_en": "Report assessment outcome and security decisions to OCC, and resume service as directed.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تقييم العنصر المفقود وتأمينه بالتعاون مع الجهات الأمنية وموظفي المحطة بنجاح",
        "text_en": "Unattended item assessed, secured in coordination with security and station staff, and operation resumed."
      }
    }
  },
  {
    sop_code: "DRI-EME-202",
    category: "emergency",
    title_en: "Traction Power Issues",
    title_ar: "أعطال في قوى الجر والطاقة الكهربائية",
    reference_documents: ["Capital Train Operator Rulebook Section 4.5", "SOPs DRI - Emergency booklet Page 8"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يمكن لبطاريات القطار تشغيل بعض الأنظمة الأساسية (التهوية، إنارة الطوارئ، الاتصالات) بحد أقصى 45 دقيقة فقط. يجب على قائد القطار مراقبة جهد البطارية باستمرار.",
        "text_en": "Train batteries can power essential systems (ventilation, emergency lighting, radios) for a maximum of 45 minutes. Monitor battery voltage continuously."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "لا تقم برفع البانتوجراف أو إعادة توصيل قاطع الدورة الرئيسي VCB بدون تصريح رسمي صريح من التحكم المركزي OCC.",
        "text_en": "Do not raise pantograph or re-close the VCB without explicit formal authorization from OCC."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "تلقي بلاغ أو كشف ذاتي عن انقطاع قوى الجر وفقدان التغذية الكهربائية العالية للقطار (1500VDC)",
        "text_en": "Detection or report of traction power loss and high voltage supply failure (1500VDC).",
        "next": "action_confirm_meters"
      },
      "action_confirm_meters": {
        "type": "action",
        "text_ar": "تأكد من حالة الفقدان عبر عداد الجهد في لوحة القيادة ومؤشرات الطاقة وشاشات TCMS بالكابينة",
        "text_en": "Confirm power loss via the voltage meter on the console, status indicators, and TCMS screens.",
        "next": "q_is_traction_at_station"
      },
      "q_is_traction_at_station": {
        "type": "question",
        "text_ar": "هل يتوقف القطار حالياً في المحطة بمحاذاة الرصيف؟",
        "text_en": "Is the train currently stopped at the station platform?",
        "yes": "action_station_actions",
        "no": "action_track_actions"
      },
      "action_station_actions": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم OCC فوراً، وافتح قاطع VCB يدويًا واخفض البانتوجراف لتأمين القطار ميكانيكياً",
        "text_en": "Notify OCC immediately, manually open VCB, and lower the pantograph to secure the train.",
        "linked_metadata": ["S2"],
        "next": "action_notify_passengers_hvac"
      },
      "action_track_actions": {
        "type": "action",
        "text_ar": "قم بالوصول بالمقود الذاتي للمحطة إن أمكن، عدا ذلك أوقف القطار فوراً باستخدام أقصى وضع لرباط الخدمة، وافتح قاطع VCB واخفض البانتوجراف",
        "text_en": "Coast to the station if possible; otherwise, stop immediately using full service brakes, open VCB, and lower the pantograph.",
        "next": "action_inform_occ_location"
      },
      "action_inform_occ_location": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم OCC فوراً بالعارض وحدد موقع القطار والكيلومتر بدقة بالغة على الخط",
        "text_en": "Immediately inform OCC of the situation and specify the train's precise location and chainage.",
        "next": "action_notify_passengers_hvac"
      },
      "action_notify_passengers_hvac": {
        "type": "action",
        "text_ar": "أبلغ الركاب عبر مكبرات الصوت بوجود عطل عام مؤقت واطلب منهم الهدوء، وتأكد من تفعيل تهوية الطوارئ بالصالون",
        "text_en": "Inform passengers via PA of a temporary power fault, advise them to remain calm, and ensure emergency ventilation is active.",
        "linked_metadata": ["S1"],
        "next": "action_open_doors_if_station"
      },
      "action_open_doors_if_station": {
        "type": "action",
        "text_ar": "طبق رباط الانتظار لتأمين وقوف القطار بالكامل، وإذا كنت في المحطة افتح الأبواب فوراً لمغادرة الركاب",
        "text_en": "Apply the parking brake to fully secure the train, and if at a station, open passenger doors immediately for egress.",
        "next": "q_power_restored"
      },
      "q_power_restored": {
        "type": "question",
        "text_ar": "هل تم إبلاغك بتوصيل التغذية الكهربائية مجدداً وعودة الطاقة للخط من قبل OCC؟",
        "text_en": "Have you been notified by OCC that traction power has been restored to the line?",
        "yes": "action_restore_panto_vcb",
        "no": "action_await_rescue_instructions"
      },
      "action_restore_panto_vcb": {
        "type": "action",
        "text_ar": "قم برفع البانتوجراف مجدداً، واغلق قاطع VCB، وتأكد من استقرار الجهد وبدء عمل المكيفات بالصالون",
        "text_en": "Raise pantograph, close VCB, and verify steady high voltage and restoration of saloon HVAC.",
        "linked_metadata": ["S2"],
        "next": "action_request_departure"
      },
      "action_request_departure": {
        "type": "action",
        "text_ar": "اطلب تصريحاً رسمياً للتحرك من OCC، واستكمل رحلتك، واكتب تقرير Driver Report في المحطة النهائية",
        "text_en": "Request departure clearance from OCC, resume trip, and file a Driver Report at the terminal station.",
        "next": "END"
      },
      "action_await_rescue_instructions": {
        "type": "action",
        "text_ar": "ابق في موقعك بانتظار تعليمات الإخلاء أو الجر باستخدام قطار إغاثة بديل وتأهب للتنسيق",
        "text_en": "Remain at your location awaiting evacuation directives or coupling instructions from a rescue train.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم التعامل مع عطل الطاقة الكهربائية للجر وتأمين القطار والركاب حسب التوجيهات المعتمدة",
        "text_en": "Traction power issue managed, train secured, and safety actions completed."
      }
    }
  },
  {
    sop_code: "DRI-EME-203",
    category: "emergency",
    title_en: "Emergency Door Unlocking",
    title_ar: "تفعيل يد فتح الطوارئ الداخلية للأبواب",
    reference_documents: ["Capital Train Operator Rulebook Section 2.15", "SOPs DRI - Emergency booklet Page 10"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "إذا تواجد القطار على الرصيف وكانت يد الطوارئ المفعلة باتجاه السكة الأخرى، يمنع فتح أبواب السكة الأخرى ويجب استخدام القيادة اليدوية لفتح أبواب جهة الرصيف فقط.",
        "text_en": "If the train is at the platform and the activated emergency handle is on the trackside, do NOT open trackside doors. Use manual mode to open platform-side doors only."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "إذا تم تفعيل يد الطوارئ وأحد الأبواب مفتوح باتجاه السكة المجاورة والقطار بين المحطات، قم فوراً بمكالمة طوارئ (EMERGENCY CALL) للمطالبة بفصل الكهرباء عن الخطين.",
        "text_en": "If emergency handle is activated and a door is open towards adjacent live tracks, make an EMERGENCY CALL to request power isolation on both tracks immediately."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "عند تفعيل يد فتح الطوارئ، يفقد القطار طاقة الجر تلقائياً ويدخل في وضع القصور الذاتي (Coasting Mode) للوقاية.",
        "text_en": "Upon emergency handle activation, traction power is automatically lost and the train enters coasting mode."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "تلقي إنذار فوري وتوهج مؤشر تفعيل مقبض طوارئ الأبواب في الكابينة وتوقف الجر بالقطار",
        "text_en": "Immediate alarm and door emergency handle indicator illuminates on the cab console, losing traction.",
        "linked_metadata": ["P1"],
        "next": "q_where_activated"
      },
      "q_where_activated": {
        "type": "question",
        "text_ar": "ما هو الموقع الحالي للقطار لحظة تفعيل مقبض طوارئ الأبواب؟",
        "text_en": "What is the current location of the train when the emergency handle is pulled?",
        "yes": "action_check_station_doors", // yes is used for "At Station Platform"
        "no": "q_is_leaving_station" // no is used for other locations
      },
      "action_check_station_doors": {
        "type": "action",
        "text_ar": "تحقق فوراً من موقع الباب المعني على شاشة TCMS وكاميرات CCTV وسجل رقم العربة والباب وتأكد من اتجاه الرصيف",
        "text_en": "Check TCMS and CCTV to pinpoint the exact door, record coach and door numbers, and verify platform side.",
        "next": "q_is_door_facing_platform"
      },
      "q_is_door_facing_platform": {
        "type": "question",
        "text_ar": "هل الباب الذي تم تفعيل يد الطوارئ له يواجه رصيف المحطة؟",
        "text_en": "Is the door with the activated emergency handle facing the platform side?",
        "yes": "action_station_standard_flow",
        "no": "action_station_track_flow"
      },
      "action_station_track_flow": {
        "type": "action",
        "text_ar": "يمنع فتح الأبواب جهة السكة الأخرى! استخدم مفتاح فتح الأبواب لفتح الأبواب المواجهة للرصيف فقط لضمان سلامة الركاب",
        "text_en": "Strictly do NOT open doors facing the live track. Manually open platform-side doors only to ensure safety.",
        "linked_metadata": ["S1"],
        "next": "action_station_standard_flow"
      },
      "action_station_standard_flow": {
        "type": "action",
        "text_ar": "أبلغ OCC بالوضع، واطلب إرسال موظفي المحطة، واستخدم الراديو لطلب مغادرة الكابينة (DRI-NOR-007) لإعادة ضبط يد الطوارئ",
        "text_en": "Inform OCC, request station staff assistance, and obtain permission to leave the cab to reset the handle.",
        "next": "action_reset_and_resume"
      },
      "q_is_leaving_station": {
        "type": "question",
        "text_ar": "هل القطار حالياً في وضع مغادرة المحطة ولم يخلِ الرصيف تماماً؟",
        "text_en": "Is the train currently departing the station and has not fully cleared the platform?",
        "yes": "action_stop_immediately_leaving",
        "no": "action_between_stations_flow"
      },
      "action_stop_immediately_leaving": {
        "type": "action",
        "text_ar": "أوقف القطار فوراً باستخدام فرامل الطوارئ لتجنب سقوط ركاب على الرصيف، وتحقق من الأبواب",
        "text_en": "Stop the train immediately using emergency brakes to prevent falls, and verify door status.",
        "next": "action_check_station_doors"
      },
      "action_between_stations_flow": {
        "type": "action",
        "text_ar": "أوقف القطار تماماً باستخدام رباط الخدمة الكامل، وراجع الكاميرات لتحديد الباب بدقة، وقم بعمل إذاعة PA للركاب لالتزام الهدوء",
        "text_en": "Bring the train to a complete stop using full service brakes, review CCTV to pinpoint the door, and broadcast a PA to passengers.",
        "next": "q_is_door_open_trackside"
      },
      "q_is_door_open_trackside": {
        "type": "question",
        "text_ar": "هل الباب مفتوح بالفعل وهناك خطر مباشر لسقوط ركاب على السكة المجاورة؟",
        "text_en": "Is the door actually open with an imminent risk of passengers falling onto adjacent tracks?",
        "yes": "action_emergency_call_power",
        "no": "action_request_cab_leave_between"
      },
      "action_emergency_call_power": {
        "type": "action",
        "text_ar": "أجرِ مكالمة طوارئ (EMERGENCY CALL) فورية لفصل طاقة الجر عن الخطوط المجاورة وتأمين محيط القطار قبل النزول",
        "text_en": "Make an immediate EMERGENCY CALL to isolate traction power on adjacent lines and secure the area.",
        "linked_metadata": ["S2"],
        "next": "action_request_cab_leave_between"
      },
      "action_request_cab_leave_between": {
        "type": "action",
        "text_ar": "اطلب ترخيص مغادرة الكابينة، توجه للباب، أعد تهيئة مقبض الطوارئ يدوياً، وتأكد من خلو القضبان من الركاب",
        "text_en": "Request cab leave permit, proceed to the door, manually reset the emergency handle, and verify tracks are clear.",
        "next": "action_reset_and_resume"
      },
      "action_reset_and_resume": {
        "type": "action",
        "text_ar": "أغلق الباب، وتأكد من رجوع لمبة إشارة الأبواب المغلقة بالكابينة، وعد لمقعدك وأبلغ OCC باستئناف التشغيل",
        "text_en": "Close the door, verify door closed loop indication is restored in the cab, return to seat, and notify OCC to resume.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إعادة ضبط يد طوارئ الأبواب وتأمين صالون الركاب والقطار بنجاح واستعادة الجر",
        "text_en": "Emergency door handle reset, passenger saloon secured, and traction power restored."
      }
    }
  },
  {
    sop_code: "DRI-EME-204",
    category: "emergency",
    title_en: "Towing or Pushing",
    title_ar: "السحب أو التدفيع للقطارات المعطلة",
    reference_documents: ["Capital Train Operator Rulebook Section 3.12", "SOPs DRI - Emergency booklet Page 17"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "هناك 3 أنواع لضم القطارات: ميكانيكي، كهربائي، وهوائي. يمنع البدء بالضم أو التحرك بقطار الإغاثة دون تصريح مكتوب ورقم أمر الضم من OCC.",
        "text_en": "Coupling types: mechanical, electrical, pneumatic. Do not initiate coupling or rescue movement without a written order and order number from OCC."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "يجب أن تكون سرعة قطار الإغاثة (Rescuing Train) عند الاقتراب الأخير (آخر 3 أمتار) لا تتعدى 3 كم/ساعة والضم يتم بمنتهى الحذر وبإشراف مباشر.",
        "text_en": "The rescue train's speed must not exceed 3 km/h during the final 3-meter approach, and coupling must be done with extreme caution."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "توقف قطار بالكامل بسبب عطل فني صلب غير قابل للإصلاح في مسار التشغيل الرئيسي والحاجة لقطار إمداد لجرّه للورشة",
        "text_en": "Train completely stranded due to an unrecoverable technical fault, requiring a rescue train for towing to depot.",
        "next": "action_align_rescuing"
      },
      "action_align_rescuing": {
        "type": "action",
        "text_ar": "تلقي أمر الضم الرسمي وتوجه قطار الإمداد ببطء صوب القطار المعطل بتوجيه وإشارات مستمرة",
        "text_en": "Receive the official coupling order, and drive the rescue train slowly toward the stranded train with signals.",
        "linked_metadata": ["S1"],
        "next": "action_final_approach"
      },
      "action_final_approach": {
        "type": "action",
        "text_ar": "أوقف قطار الإمداد على مسافة 3 أمتار قبل رأس القطار المعطل، وتأكد من محاذاة الرؤوس، ثم تحرك بسرعة 3 كم/س لإتمام الضم",
        "text_en": "Stop the rescue train 3 meters before the stranded train, ensure couplers are aligned, then move at 3 km/h to couple.",
        "linked_metadata": ["S2"],
        "next": "q_coupling_type"
      },
      "q_coupling_type": {
        "type": "question",
        "text_ar": "ما هو نوع الضم المطلوب تنفيذه للقطارين حالياً بناء على تعليمات مركز التحكم وصيانة الورشة؟",
        "text_en": "Which coupling type is required based on OCC and depot maintenance directives?",
        "yes": "action_full_mechanical_electrical", // Yes represents Full mechanical & electrical coupling
        "no": "action_pneumatic_brake_isolation" // No represents Mechanical & pneumatic with brake isolation
      },
      "action_full_mechanical_electrical": {
        "type": "action",
        "text_ar": "قم بإتمام التوصيل الكهربائي والميكانيكي المشترك بالكامل وتنشيط قواطع الروابط الكهربية لضمان تحكم موحد بين الكابينتين",
        "text_en": "Complete full mechanical and electrical coupling and activate electrical coupler switches for unified control.",
        "next": "action_joint_brake_test"
      },
      "action_pneumatic_brake_isolation": {
        "type": "action",
        "text_ar": "قم بالضم الميكانيكي وتأمين خراطيم الهواء، ثم توجه لعزل فرامل القطار المعطل عبر مقابض العزل لضمان تحريرها تماماً أثناء السحب",
        "text_en": "Complete mechanical coupling and air hose connections, then isolate the stranded train's brakes to ensure full release.",
        "next": "action_joint_brake_test"
      },
      "action_joint_brake_test": {
        "type": "action",
        "text_ar": "قم بإجراء اختبار فرامل مشترك (Joint Brake Test) للتأكد من ربط وتجاوب المكابح بالقطارين بالكامل وسلامة الضم",
        "text_en": "Perform a joint brake test to verify combined brake response and coupling integrity of both train sets.",
        "next": "action_safe_towing_depot"
      },
      "action_safe_towing_depot": {
        "type": "action",
        "text_ar": "تحرك ببطء وفق السرعات المحددة لعملية الجر (لا تتجاوز 25 كم/س) متجهاً بحذر صوب ورشة الصيانة لتفريغ القطار",
        "text_en": "Depart slowly in accordance with towing speed limits (max 25 km/h) toward the maintenance depot.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم ضم وسحب القطار المعطل بنجاح وإيصاله للورشة وتأمين خلو الخط الرئيسي للخدمة",
        "text_en": "Stranded train successfully coupled and towed to the depot, clearing the mainline for revenue service."
      }
    }
  },
  {
    sop_code: "DRI-EME-205",
    category: "emergency",
    title_en: "Fire or Smoke on the Train",
    title_ar: "حريق أو انبعاث دخان على متن القطار",
    reference_documents: ["RATP Dev Cairo Disaster Management Plan Section 5", "SOPs DRI - Emergency booklet Page 28"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يمنع تماماً إيقاف القطار داخل النفق إذا كان الحريق مشتعلاً في عربات القطار؛ بل يجب الاستمرار في القيادة حتى المحطة التالية لضمان التهوية وتسهيل عملية الإخلاء.",
        "text_en": "It is absolutely forbidden to stop the train inside a tunnel if a fire is active; you MUST continue driving to the next station to ensure ventilation and facilitate evacuation."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "في حالة التوقف الاضطراري بالمسار المفتوح، يجب تفعيل مروحة طرد الدخان بالاتجاه المعاكس لاتجاه الرياح لإبعاد الدخان عن الركاب أثناء الإخلاء.",
        "text_en": "In case of emergency stop on an open track, activate the smoke extraction fans in the direction opposite to wind flow to keep smoke away from passengers during evacuation."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "قم بتهدئة الركاب عبر نظام الإذاعة الداخلية (PA) لمنع التدافع والهلع والتأكد من فتح الاتصال بالإنتركوم.",
        "text_en": "Reassure passengers via the Passenger Announcement (PA) system to prevent stampede and panic, and verify intercom line is active."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "انطلاق إنذار الحريق التلقائي بالقطار أو إبلاغ قائد القطار من الركاب بوجود دخان أو نار.",
        "text_en": "Automatic fire alarm triggers in the cab, or passenger interphone reports smoke or active fire.",
        "linked_metadata": ["P1"],
        "next": "q_is_inside_tunnel_205"
      },
      "q_is_inside_tunnel_205": {
        "type": "question",
        "text_ar": "هل يتواجد القطار حالياً داخل نفق (Tunnel Section)؟",
        "text_en": "Is the train currently inside a tunnel section?",
        "yes": "action_drive_next_station_205",
        "no": "action_emergency_stop_track_205"
      },
      "action_drive_next_station_205": {
        "type": "action",
        "text_ar": "استمر بالقيادة فوراً إلى المحطة التالية. أبلغ مركز التحكم والخدمات الطارئة للتأهب في تلك المحطة.",
        "text_en": "Continue driving immediately to the next station. Notify CC and Emergency Services to stand by at that station.",
        "linked_metadata": ["S1"],
        "next": "action_station_evacuate_205"
      },
      "action_emergency_stop_track_205": {
        "type": "action",
        "text_ar": "قم بتطبيق الفرملة الكاملة حتى يتوقف القطار تماماً بالمنطقة المفتوحة. أبلغ مركز التحكم بالموقع الدقيق.",
        "text_en": "Apply full brakes until the train stops completely on the open track. Inform CC of the exact location.",
        "next": "action_track_evacuate_205"
      },
      "action_station_evacuate_205": {
        "type": "action",
        "text_ar": "عند الوصول للمحطة، افتح جميع الأبواب فوراً، واقطع التيار الكهربائي عن القطار، وابدأ بإخلاء المحطة والقطار بمساعدة الموظفين.",
        "text_en": "Upon arrival at the station, open all doors immediately, drop main traction power, and initiate passenger evacuation with station staff.",
        "next": "END"
      },
      "action_track_evacuate_205": {
        "type": "action",
        "text_ar": "افتح أبواب الطوارئ بالقطار، وأشرف على نزول الركاب للممشى المخصص بجانب السكة (Walkway) بعيداً عن كابلات الطاقة.",
        "text_en": "Open emergency doors, and supervise passenger descent onto the dedicated evacuation walkway, away from live traction power rails.",
        "linked_metadata": ["S2"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إخلاء الركاب وتأمين القطار بانتظار فرق الإطفاء والإنقاذ",
        "text_en": "Passengers evacuated and train secured. Awaiting civil defense and rescue squads."
      }
    }
  },
  {
    sop_code: "DRI-EME-206",
    category: "emergency",
    title_en: "Train Evacuation Interstation",
    title_ar: "إخلاء القطار بين المحطات",
    reference_documents: ["Capital Train Operator Rulebook Section 3.15", "SOPs DRI - Emergency booklet Page 33"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يمنع فتح الأبواب والبدء بإخلاء الركاب إلى السكة دون تأكيد رسمي قاطع من OCC بفصل الكهرباء عن مساري السكك وتأريضها.",
        "text_en": "It is strictly forbidden to open doors and evacuate passengers to the tracks without formal OCC confirmation of power isolation."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "يجب على قائد القطار تفقد عربات القطار والتأكد من خلوها تماماً من الركاب قبل إغلاق الكابينة ومغادرة القطار.",
        "text_en": "The driver must inspect all coaches to ensure they are completely clear of passengers before securing the train and leaving."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "صدور قرار نهائي من OCC بإخلاء القطار العالق بين محطتين بسبب عطل جسيم ممتد مع تعذر جره",
        "text_en": "OCC issues evacuation order for a stranded train between stations due to an unrecoverable major fault.",
        "next": "action_confirm_power_cut"
      },
      "action_confirm_power_cut": {
        "type": "action",
        "text_ar": "انتظر استلام تأكيد قاطع ورقم تصريح بفصل القوى الكهربائية العالية وتأريض القضبان بالكامل بالمنطقة",
        "text_en": "Await absolute verification and permit number for traction power isolation and track grounding in the zone.",
        "linked_metadata": ["S1"],
        "next": "action_pa_evac_instructions"
      },
      "action_pa_evac_instructions": {
        "type": "action",
        "text_ar": "قم بإجراء إذاعة عامة هادئة لإبلاغ الركاب بقرار الإخلاء وتوجيههم لاتباع تعليمات السلامة وبدء النزول المنظم",
        "text_en": "Make a calm PA announcement explaining the evacuation decision and guiding passengers to follow safety instructions.",
        "next": "action_deploy_ladders"
      },
      "action_deploy_ladders": {
        "type": "action",
        "text_ar": "افتح أبواب الإخلاء والمنافذ المخصصة بالقطار وقم بتركيب وتأمين سلالم النزول الاضطراري (Evacuation Ladders) باتجاه الممشى",
        "text_en": "Open emergency exits and deploy/secure evacuation ladders leading to the designated walkway.",
        "next": "action_supervise_descent"
      },
      "action_supervise_descent": {
        "type": "action",
        "text_ar": "أشرف بصرياً على نزول الركاب خطوة بخطوة بالتعاون مع طاقم القطار والأمن ومساعدتهم في العبور الآمن للممشى",
        "text_en": "Supervise the passengers' descent onto the walkway in coordination with train crew and security.",
        "next": "action_sweep_coaches"
      },
      "action_sweep_coaches": {
        "type": "action",
        "text_ar": "قم بجولة تفتيشية دقيقة وكاملة داخل كافة عربات وصالونات القطار للتأكد من خلوه من أي راكب أو أمتعة متبقية",
        "text_en": "Conduct a thorough sweep of all train coaches to ensure no passengers or personal items are left behind.",
        "linked_metadata": ["S2"],
        "next": "action_secure_train_exit"
      },
      "action_secure_train_exit": {
        "type": "action",
        "text_ar": "أغلق أبواب صالون الركاب بالكامل، وأمن الكابينة بوضع مفتاح الاتجاه على صفر، ثم انزل للممشى وغادر محيط السكة",
        "text_en": "Close all saloon doors, secure the cab (reversing key to zero), descend to the walkway, and exit the track area.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إخلاء جميع الركاب بنجاح وتوجيههم للمحطة وتأمين القطار بالكامل على السكة العالقة",
        "text_en": "All passengers evacuated to safety, guided to the station, and the train secured on the track."
      }
    }
  },
  {
    sop_code: "DRI-EME-208",
    category: "emergency",
    title_en: "Train Collision",
    title_ar: "تصادم القطار أو الارتطام بعائق",
    reference_documents: ["RATP Dev Cairo Disaster Management Plan Section 6", "SOPs DRI - Emergency booklet Page 36"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "عند وقوع تصادم، يجب فوراً تطبيق فرملة الطوارئ الكهروهيدروليكية وخفض البانتوجراف وقطع الكهرباء عن القطار لمنع حدوث ماس أو حريق.",
        "text_en": "Upon collision, immediately apply emergency brakes, lower the pantograph, and cut train power to prevent fires."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "حدوث ارتطام أو تصادم للقطار بعائق صلب على السكة أو بقطار آخر في مسار التشغيل",
        "text_en": "A collision occurs with an obstacle on the tracks or with another train.",
        "next": "action_apply_emergency_brake"
      },
      "action_apply_emergency_brake": {
        "type": "action",
        "text_ar": "اضغط فوراً على زر فرملة الطوارئ (المشروم الأحمر)، وافتح قاطع VCB، وخفض البانتوجراف بالكامل",
        "text_en": "Immediately press the emergency brake button, open the VCB, and lower the pantograph completely.",
        "linked_metadata": ["S1"],
        "next": "action_emergency_call_occ"
      },
      "action_emergency_call_occ": {
        "type": "action",
        "text_ar": "أجرِ مكالمة طوارئ (EMERGENCY CALL) لإعلام مركز OCC بوقوع الحادث وموقعك لإيقاف الحركة بالخط بالكامل وفصل الكهرباء",
        "text_en": "Make an immediate EMERGENCY CALL to notify OCC of the collision to halt all traffic and cut power.",
        "next": "action_assess_casualties"
      },
      "action_assess_casualties": {
        "type": "action",
        "text_ar": "تحقق من سلامة نفسك أولاً ثم سلامة الركاب في الصالون عبر الكاميرات، وحدد وجود إصابات أو أضرار هيكلية جسيمة بالقطار",
        "text_en": "Verify your own safety first, then assess passenger safety via CCTV and inspect for casualties or structural damage.",
        "next": "action_broadcast_pa_reassure"
      },
      "action_broadcast_pa_reassure": {
        "type": "action",
        "text_ar": "قم بعمل إذاعة عامة (PA) للركاب لطمأنتهم ودعوتهم للالتزام بالهدوء ريثما تصل فرق الدعم والإسعاف وقوات الحماية المدنية",
        "text_en": "Broadcast a PA announcement to reassure passengers and advise them to remain calm until rescue teams arrive.",
        "next": "action_await_rescue_squad"
      },
      "action_await_rescue_squad": {
        "type": "action",
        "text_ar": "ابق في كابينتك النشطة ممسكاً بالاتصالات بالتنسيق مع OCC لفتح الأبواب لبدء خطة الطوارئ والإخلاء مع فريق الإنقاذ",
        "text_en": "Remain in communication with OCC, preparing to initiate emergency evacuation with rescue services.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم اتخاذ كافة تدابير الطوارئ الأولية وتأمين القطار بانتظار لجان التحقيق وقوات الحماية المدنية",
        "text_en": "Emergency actions taken and train secured, awaiting official investigation and civil defense."
      }
    }
  },
  {
    sop_code: "DRI-EME-209",
    category: "emergency",
    title_en: "Train Derailment",
    title_ar: "انحراف القطار عن القضبان (الخروج عن السكة)",
    reference_documents: ["RATP Dev Cairo Disaster Management Plan Section 7", "SOPs DRI - Emergency booklet Page 38"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "عند حدوث خروج عن القضبان، يمنع تماماً تحريك القطار للأمام أو للخلف. يجب تثبيت القطار فوراً في موقعه باستخدام الفرامل اليدوية لضمان ثباته.",
        "text_en": "In case of derailment, do NOT move the train forward or backward. Secure the train immediately using manual parking brakes."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "شعور بهزات عنيفة وارتجاج غير طبيعي متبوع بسماع صوت احتكاك شديد مع توقف حركة العجلات وانحراف القطار عن السكة",
        "text_en": "Violent vibrations and abnormal shaking followed by severe grinding sounds and wheels leaving the rails.",
        "next": "action_derail_emergency_stop"
      },
      "action_derail_emergency_stop": {
        "type": "action",
        "text_ar": "اضغط فوراً على زر فرملة الطوارئ (المشروم)، طبق فرامل الخدمة بالكامل، وافتح قاطع VCB، وخفض البانتوجراف",
        "text_en": "Immediately press the emergency brake button, apply full service brakes, open VCB, and lower the pantograph.",
        "linked_metadata": ["S1"],
        "next": "action_derail_emergency_call"
      },
      "action_derail_emergency_call": {
        "type": "action",
        "text_ar": "قم بإجراء مكالمة طوارئ (EMERGENCY CALL) لإبلاغ OCC بالخروج عن القضبان وتحديد العربات المتضررة بدقة",
        "text_en": "Make an immediate EMERGENCY CALL to inform OCC of the derailment and report the affected coaches.",
        "next": "action_derail_reassure_pa"
      },
      "action_derail_reassure_pa": {
        "type": "action",
        "text_ar": "أعلن للركاب عبر نظام PA بحدوث عارض تشغيلي مفاجئ وتثبيت القطار، وحذرهم بشدة من النزول للسكة منعا للدهس والصعق",
        "text_en": "Inform passengers via PA of a sudden derailment, and warn them strictly against descending onto the tracks.",
        "next": "action_await_evacuation_team"
      },
      "action_await_evacuation_team": {
        "type": "action",
        "text_ar": "أمن الكابينة وابق على تواصل مع مركز OCC، ونسق مع فرق الطوارئ المحتشدة لبدء إخلاء الركاب للمنطقة الآمنة",
        "text_en": "Secure the cab, maintain radio contact with OCC, and coordinate with emergency teams to begin passenger evacuation.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إيقاف وتأمين القطار الخارج عن القضبان بنجاح والتنسيق لبدء إخلاء الركاب بأمان",
        "text_en": "Derailed train safely secured and emergency evacuation operations initiated."
      }
    }
  },
  {
    sop_code: "DRI-EME-210",
    category: "emergency",
    title_en: "Intrusion on the Tracks",
    title_ar: "تواجد أو دخول شخص غير مصرح له على السكة",
    reference_documents: ["Capital Train Operator Rulebook Section 1.15", "SOPs DRI - Emergency booklet Page 40"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "إذا رصدت شخصاً على السكة، طبق فرامل الطوارئ فوراً وأطلق السارينة والسرعة صفر. لا تتحرك مطلقاً حتى تتلقى إشعاراً بخلو الخط بالكامل.",
        "text_en": "If you detect a person on the tracks, apply emergency brakes immediately and sound the horn. Do NOT move until notified that the tracks are clear."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "رصد شخص أو عامل غير مصرح بتواجده يمشي أو يقف على مسار السكة الحديدية أمام القطار أثناء المسير",
        "text_en": "A person or unauthorized worker is spotted walking or standing on the tracks ahead of the train.",
        "next": "action_apply_emergency_brake_intrusion"
      },
      "action_apply_emergency_brake_intrusion": {
        "type": "action",
        "text_ar": "اضغط على زر فرملة الطوارئ فوراً لإيقاف القطار بأقصر مسافة ممكنة، وأطلق السارينة بشكل متقطع لتنبيه الشخص",
        "text_en": "Apply emergency brakes immediately to stop the train, and sound the horn repeatedly to alert the intruder.",
        "linked_metadata": ["S1"],
        "next": "action_inform_occ_intrusion"
      },
      "action_inform_occ_intrusion": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم OCC فوراً بمكالمة طوارئ وحدد الكيلومتر والاتجاه ومواصفات الشخص وحالته بدقة",
        "text_en": "Notify OCC immediately via emergency call, specifying the chainage, direction, and description of the person.",
        "next": "q_did_collision_occur"
      },
      "q_did_collision_occur": {
        "type": "question",
        "text_ar": "هل حدث اصطدام أو ارتطام فعلي بالشخص المتواجد على القضبان؟",
        "text_en": "Did a collision actually occur with the person on the tracks?",
        "yes": "action_stop_emergency_and_wait",
        "no": "q_has_intruder_left"
      },
      "action_stop_emergency_and_wait": {
        "type": "action",
        "text_ar": "حافظ على التوقف التام للقطار، وافتح VCB لقطع الكهرباء، واستأذن للنزول للتحقق إذا طلب منك OCC ذلك، بانتظار الإسعاف",
        "text_en": "Keep the train fully stopped, open VCB, and await rescue and emergency services.",
        "next": "END"
      },
      "q_has_intruder_left": {
        "type": "question",
        "text_ar": "هل غادر الشخص ممر السكة وابتعد تماماً عن حيز حركة القطارات؟",
        "text_en": "Has the intruder left the track area and cleared the train path?",
        "yes": "action_resume_cautious_driving",
        "no": "action_wait_security_intervention"
      },
      "action_resume_cautious_driving": {
        "type": "action",
        "text_ar": "أبلغ OCC بخلو السكة، واطلب تصريحاً لمواصلة الرحلة يدوياً بسرعة مخفضة لا تتعدى 25 كم/ساعة لمراقبة المنطقة",
        "text_en": "Inform OCC that the track is clear, and request permission to proceed manually at a speed not exceeding 25 km/h.",
        "next": "END"
      },
      "action_wait_security_intervention": {
        "type": "action",
        "text_ar": "انتظر في موقعك دون أي حركة للقطار ريثما يتدخل موظفو الأمن أو المحطة لإخلاء الشخص وتأمين السكة بالكامل",
        "text_en": "Remain stationary, awaiting security or station staff intervention to clear the person and secure the tracks.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم التعامل مع عارض التواجد على السكة وضمان خلو الخط وسلامة الأفراد قبل استئناف مسير القطار",
        "text_en": "Intrusion handled, track clearance confirmed, and operation safely managed."
      }
    }
  },
  {
    sop_code: "DRI-EME-211",
    category: "emergency",
    title_en: "Emergency Traction Mode",
    title_ar: "تفعيل نظام تغذية الطوارئ المباشرة ETM",
    reference_documents: ["Capital Train Operator Rulebook Section 4.10", "SOPs DRI - Emergency booklet Page 42"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يمنع تماماً تشغيل أو تفعيل نظام تغذية الطوارئ المباشرة (ETM) دون الحصول على إذن وتصريح تشغيل صريح معتمد من OCC.",
        "text_en": "Strictly do NOT activate Emergency Traction Mode (ETM) without explicit formal permission from OCC."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "أثناء القيادة بنظام ETM، تكون قوة الجر محدودة بنسبة 50% إلى 100%، ويجب ألا تزيد سرعة القطار القصوى عن 60 كم/ساعة.",
        "text_en": "Under ETM, traction power is limited, and the train's maximum speed must not exceed 60 km/h."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "حدوث عطل جسيم في دوائر التحكم بقوى الجر بالقطار وفقد إشارة الجر الطبيعية مع تعذر الحركة بالوضع العادي",
        "text_en": "Major traction control circuit failure occurs, losing normal traction signals with inability to move under normal mode.",
        "next": "action_report_occ_etm"
      },
      "action_report_occ_etm": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم OCC بتفاصيل العطل البرمجي واستقر وقوف القطار بالكامل وطبق فرامل الانتظار",
        "text_en": "Inform OCC of traction control failure, secure the train with parking brakes, and report status.",
        "next": "q_get_etm_permit"
      },
      "q_get_etm_permit": {
        "type": "question",
        "text_ar": "هل تم إصدار تصريح تفعيل نظام تغذية الطوارئ المباشرة (ETM Permit) من OCC؟",
        "text_en": "Has OCC issued authorization to activate Emergency Traction Mode (ETM)?",
        "yes": "action_switch_to_etm",
        "no": "action_wait_depot_technicians"
      },
      "action_wait_depot_technicians": {
        "type": "action",
        "text_ar": "أوقف المحاولات، وابق ثابتاً بانتظار وصول فنيي الصيانة أو قطار الإغاثة لتنفيذ عملية الجر للقطار المعطل",
        "text_en": "Cease attempts and remain stationary, awaiting maintenance technicians or a rescue train.",
        "next": "END"
      },
      "action_switch_to_etm": {
        "type": "action",
        "text_ar": "توجه للوحة مفاتيح الأمان بالكابينة، وأدر مفتاح ETM لوضع التفعيل، وتأكد من تفعيل الكابينة الخلفية والأنظمة الحليفة",
        "text_en": "Proceed to the safety switches panel in the cab, turn the ETM switch to the active position, and verify activation.",
        "linked_metadata": ["S1"],
        "next": "action_raise_panto_etm"
      },
      "action_raise_panto_etm": {
        "type": "action",
        "text_ar": "قم برفع البانتوجراف وغلق قاطع VCB، وتأكد عبر شاشة TCMS من قبول القطار للتفعيل وسريان الطاقة لدوائر الجر الطارئة",
        "text_en": "Raise pantograph and close VCB, and verify on TCMS that emergency traction circuits are powered.",
        "next": "action_drive_etm_safe"
      },
      "action_drive_etm_safe": {
        "type": "action",
        "text_ar": "قم بقيادة القطار يدوياً بحذر شديد وبسرعة مخفضة لا تزيد عن 60 كم/ساعة مغادراً السكة للورشة بمحاذاة الرصيف",
        "text_en": "Drive the train manually with high vigilance at a reduced speed not exceeding 60 km/h toward the depot.",
        "linked_metadata": ["S2"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تنشيط نظام تغذية الطوارئ المباشرة وتحريك القطار العالق بنجاح لإخلاء الخط الرئيسي",
        "text_en": "Emergency Traction Mode successfully activated, and the train moved to clear the mainline."
      }
    }
  },
  {
    sop_code: "DRI-EME-212",
    category: "emergency",
    title_en: "Rescue Train (Side by Side)",
    title_ar: "قطار الإمداد جنباً إلى جنب (إخلاء الركاب محاذاة)",
    reference_documents: ["RATP Dev Cairo Disaster Management Plan Section 8", "SOPs DRI - Emergency booklet Page 45"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "تعتبر سلامة الركاب هي الأولوية القصوى في هذه العملية. يمنع البدء بمد الجسور المعدنية والعبور دون حضور موظفي المحطة والأمن للمساعدة.",
        "text_en": "Passenger safety is the absolute priority. Do NOT deploy the bridge plate or initiate passenger transfer without station staff and security."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "تأكد تماماً من ربط وتثبيت فرامل القطارين بالكامل، وفصل التيار الكهربائي عن الخطين قبل بدء عملية عبور الركاب.",
        "text_en": "Ensure both trains are fully secured with brakes applied, and traction power is isolated on both tracks before starting transfer."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "اتخاذ قرار من OCC بإخلاء الركاب من قطار معطل عالق بالمسار إلى قطار إغاثة بمحاذاته جنباً إلى جنب",
        "text_en": "OCC decision to evacuate passengers from a stranded train to a rescue train positioned side-by-side.",
        "next": "action_align_rescue_train"
      },
      "action_align_rescue_train": {
        "type": "action",
        "text_ar": "تحرك بقطار الإغاثة ببطء شديد وتوقف بمحاذاة القطار المعطل تماماً، وتأكد من مطابقة ومحاذاة الأبواب الجانبية بين القطارين بدقة",
        "text_en": "Drive the rescue train slowly and stop exactly alongside the stranded train, aligning the side doors precisely.",
        "next": "action_verify_trains_secured"
      },
      "action_verify_trains_secured": {
        "type": "action",
        "text_ar": "تأكد من تطبيق رباط الخدمة الكامل وفرامل الانتظار بكلا القطارين لضمان عدم حدوث أي تباعد أو حركة ميكانيكية مفاجئة",
        "text_en": "Verify that full service and parking brakes are applied on both trains to prevent any relative movement.",
        "linked_metadata": ["S2"],
        "next": "action_deploy_bridge_plate"
      },
      "action_deploy_bridge_plate": {
        "type": "action",
        "text_ar": "افتح الأبواب المتطابقة يدوياً، وقم بتركيب وتثبيت جسر عبور الطوارئ المعدني (Bridge Plate) وتأمينه بمشابك التثبيت لمنع السقوط",
        "text_en": "Manually open the aligned doors and deploy/secure the emergency bridge plate with safety clamps.",
        "next": "action_transfer_passengers"
      },
      "action_transfer_passengers": {
        "type": "action",
        "text_ar": "أشرف بالتنسيق مع موظفي المحطة والأمن على عبور الركاب هادئاً فرداً فرداً فوق الجسور صوب قطار الإمداد الآمن",
        "text_en": "Supervise passenger transfer across the bridge plates in coordination with station staff and security.",
        "linked_metadata": ["S1"],
        "next": "action_remove_bridge_close"
      },
      "action_remove_bridge_close": {
        "type": "action",
        "text_ar": "بعد اكتمال العبور بالكامل، أزل جسور الطوارئ المعدنية وأغلق أبواب القطارين تماماً وأبلغ OCC بإتمام العملية",
        "text_en": "After completion, remove all bridge plates, close all train doors fully, and report completion to OCC.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إخلاء ونقل الركاب بنجاح جنباً إلى جنب وتأمين القطارين بالكامل على مسارات الخط",
        "text_en": "Passengers successfully transferred side-by-side, doors secured, and both trains stabilized."
      }
    }
  },
  {
    sop_code: "DRI-EME-213",
    category: "emergency",
    title_en: "Casualty on the Track",
    title_ar: "ضحايا أو إصابات بشرية على مسار السكة",
    reference_documents: ["Capital Train Operator Rulebook Section 1.20", "SOPs DRI - Emergency booklet Page 49"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يمنع تماماً مغادرة كابينة القيادة أو النزول للسكة للتحقق من المصاب دون الحصول على إذن صريح وفصل مؤكد وتأريض كامل للتيار الكهربائي.",
        "text_en": "Do NOT leave the cab or descend to the tracks to check a casualty without explicit permission and confirmed power isolation."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "سقوط شخص أو حدوث اصطدام بشرى على القضبان مع شك في وجود إصابات أو ضحايا بممر السير",
        "text_en": "A person falls or is struck by the train, with suspected casualties on the trackway.",
        "next": "action_stop_emergency_and_horn"
      },
      "action_stop_emergency_and_horn": {
        "type": "action",
        "text_ar": "طبق فرملة الطوارئ فوراً لإيقاف القطار بالكامل، أطلق السارينة، وافتح VCB لقطع الكهرباء تلقائياً",
        "text_en": "Apply emergency brakes immediately to halt the train, sound the horn, and open VCB.",
        "next": "action_emergency_call_occ_casualty"
      },
      "action_emergency_call_occ_casualty": {
        "type": "action",
        "text_ar": "قم بإجراء مكالمة طوارئ (EMERGENCY CALL) لإعلام OCC فوراً بالحادثة والمطالبة بإرسال الإسعاف والدعم الأمني والمطافئ للموقع",
        "text_en": "Make an immediate EMERGENCY CALL to inform OCC, requesting ambulance, medical support, and emergency services.",
        "next": "action_reassure_passengers_pa"
      },
      "action_reassure_passengers_pa": {
        "type": "action",
        "text_ar": "أبلغ الركاب عبر نظام الإذاعة الداخلية (PA) بوقوف القطار لعارض طارئ واطلب منهم الهدوء وعدم محاولة مغادرة العربات مطلقا",
        "text_en": "Inform passengers via PA of an emergency stop, advising them to stay calm and remain inside the train.",
        "next": "action_wait_for_rescue_staff"
      },
      "action_wait_for_rescue_staff": {
        "type": "action",
        "text_ar": "ابق في كابينتك النشطة ممسكاً بالاتصالات، ولا تنزل للسكة إلا بتصريح OCC وحضور ناظر المحطة وفرق الإنقاذ لتولي الموقف",
        "text_en": "Remain inside the cab and maintain radio communication; do not descend unless authorized and assisted by rescue teams.",
        "linked_metadata": ["S1"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم اتخاذ الإجراءات الطارئة وإيقاف القطار وتأمين الموقع وتولي جهات الإنقاذ الطبي التعامل مع الإصابات",
        "text_en": "Emergency stop performed, location secured, and medical rescue operations handed over to authorities."
      }
    }
  },
  {
    sop_code: "DRI-EME-214",
    category: "emergency",
    title_en: "Authorised ATP-Off Train Movement",
    title_ar: "قيادة القطار بنظام ATP-Off المرخص",
    reference_documents: ["Capital Train Operator Rulebook Section 3.10", "SOPs DRI - Emergency booklet Page 51"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يمنع تماماً قيادة القطار بنظام ATP-Off (إيقاف نظام الحماية الآلي) دون استلام أمر تشغيل مكتوب أو إشعار مباشر برقم تصريح من OCC.",
        "text_en": "Never drive with ATP-Off without receiving written authorization or a formal verbal permit number from OCC."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "عند القيادة بنظام ATP-Off، يجب عدم تجاوز السرعة القصوى 40 كم/ساعة والقيادة بتركيز بصري فائق ومراقبة كاملة للخط والإشارات الجانبية.",
        "text_en": "When driving with ATP-Off, do NOT exceed 40 km/h and drive with absolute visual vigilance and manual speed control."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "حدوث فشل عام في إشارات السكة أو عطل في نظام استقبال الإشارات بالقطار وتلقي أمر بالتحرك بدون نظام الحماية الآلي",
        "text_en": "Complete signaling failure or on-board ATP receiver fault, requiring movement with automatic protection bypassed.",
        "next": "action_secure_train_stop_atp"
      },
      "action_secure_train_stop_atp": {
        "type": "action",
        "text_ar": "أوقف القطار بالكامل وطبق فرامل الخدمة قبل الإقدام على أي خطوة تشغيلية",
        "text_en": "Bring the train to a complete stop and apply service brakes before taking any operational steps.",
        "next": "q_get_atp_authorization"
      },
      "q_get_atp_authorization": {
        "type": "question",
        "text_ar": "هل تم استلام تفويض أو رقم تصريح رسمي معتمد للقيادة بنظام ATP-Off من OCC؟",
        "text_en": "Has a formal written or verbal ATP-Off authorization number been received from OCC?",
        "yes": "action_switch_to_atp_off",
        "no": "action_remain_stopped_atp"
      },
      "action_remain_stopped_atp": {
        "type": "action",
        "text_ar": "ابق متوقفاً في موقعك الحالي بالكامل ولا تتحرك شبراً واحداً حتى يصدر الترخيص الرسمي تفادياً للاصطدام",
        "text_en": "Remain completely stationary and do not move until the official authorization is issued to prevent collisions.",
        "next": "END"
      },
      "action_switch_to_atp_off": {
        "type": "action",
        "text_ar": "أدر مفتاح ATCB الخاص بنظام الحماية في الكابينة إلى وضع التجاوز (Bypass) أو الإيقاف (ATP-Off) لتنشيط الجر اليدوي",
        "text_en": "Turn the ATCB switch in the cab to the Bypass / ATP-Off position to activate manual traction override.",
        "linked_metadata": ["S1"],
        "next": "action_drive_atp_off_manual"
      },
      "action_drive_atp_off_manual": {
        "type": "action",
        "text_ar": "قم بقيادة القطار يدوياً بنظام LMD، والتزم التزاماً صارماً بسرعة قصوى لا تتجاوز 40 كم/ساعة، مع إبقاء يدك على مقبض رجل الميت",
        "text_en": "Drive the train manually under LMD, strictly adhering to a maximum speed of 40 km/h, keeping hand on deadman.",
        "linked_metadata": ["S2"],
        "next": "action_restore_normal_atp"
      },
      "action_restore_normal_atp": {
        "type": "action",
        "text_ar": "عند الوصول للمنطقة السليمة ذات الإشارات، أوقف القطار وأعد المفتاح للوضع الطبيعي وتأكد من عمل حماية القطار مجدداً",
        "text_en": "Upon reaching a healthy signaling zone, stop the train, return the switch to Normal, and verify ATP protection is active.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم قيادة القطار بنظام ATP-Off وتأمين مروره وتجاوز منطقة العطل بنجاح وأمان",
        "text_en": "Train driven under authorized ATP-Off mode, safely crossing the signaling failure zone."
      }
    }
  },
  {
    sop_code: "DRI-EME-215",
    category: "emergency",
    title_en: "Rescue by Locomotive",
    title_ar: "ضم وفصل القطارات باستخدام جرار الديزل",
    reference_documents: ["Capital Train Operator Rulebook Section 3.20", "SOPs DRI - Emergency booklet Page 53"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "قبل إزالة لجام العجل (Chocks) أو التحرك، يجب على قائد القطار المعطل التنسيق التام مع قائد جرار الديزل والتأكد من إرسال إشارات الضغط الهوائي السليم لفك الفرامل.",
        "text_en": "Before removing wheel chocks or moving, coordinate fully with the diesel locomotive driver and verify correct pneumatic pressure."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "تأكد من إغلاق صمامات عزل فرامل الهواء B09 بجميع عربات القطار المعطل يدوياً قبل بدء السحب بجرار الديزل لمنع انحشار الفرامل.",
        "text_en": "Ensure all coach B09 brake isolation valves are properly configured manually before towing with the diesel locomotive."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "الحاجة لجر القطار المعطل العالق بالخط باستخدام جرار الديزل المخصص لإخلاء المسار لتعذر الجر الكهربائي",
        "text_en": "Need to tow a disabled train using a diesel rescue locomotive due to electrical towing unavailability.",
        "next": "action_align_locomotive"
      },
      "action_align_locomotive": {
        "type": "action",
        "text_ar": "وجه جرار الديزل للتقارب ببطء شديد مع القطار، وتوقف على مسافة آمنة قبل الضم النهائي لمطابقة مستوى رأس التعشيق",
        "text_en": "Guide the diesel locomotive to approach slowly, stopping at a safe distance before final alignment.",
        "next": "action_couple_mechanically"
      },
      "action_couple_mechanically": {
        "type": "action",
        "text_ar": "أتم عملية الضم الميكانيكي لخطاف السحب وتوصيل خراطيم الهواء الرئيسية المخصصة للتغذية بفرامل القطار المعطل",
        "text_en": "Complete mechanical coupling of the draft gear and connect main reservoir air hoses to the disabled train.",
        "next": "action_configure_valves"
      },
      "action_configure_valves": {
        "type": "action",
        "text_ar": "افتح صمامات التوصيل الهوائي بالجرار، وتأكد من سلامة توصيل الضغط الهوائي لضمان فك وتحرير فرامل القطار المعطل بالكامل",
        "text_en": "Open locomotive air valves, and verify pneumatic pressure flow to fully release the disabled train's brakes.",
        "linked_metadata": ["S2"],
        "next": "action_joint_pressure_check"
      },
      "action_joint_pressure_check": {
        "type": "action",
        "text_ar": "تأكد من شحن خزان الهواء الرئيسي ووصول ضغط الفرامل للحد القياسي (بين 5 إلى 7 بار) وسلامة التعشيق وبدأ السحب ببطء",
        "text_en": "Verify the main air reservoir is charged and brake pressure is correct (5 to 7 bar) before commencing slow towing.",
        "linked_metadata": ["S1"],
        "next": "action_tow_safely_depot"
      },
      "action_tow_safely_depot": {
        "type": "action",
        "text_ar": "قم بسحب القطار المعطل متجهاً بحذر لورشة الصيانة بسرعة لا تتعدى 15 كم/ساعة والامتثال التام لإرشادات مراقبي الحركة",
        "text_en": "Tow the disabled train carefully to the depot at a speed not exceeding 15 km/h, complying with traffic controllers.",
        "next": "action_uncouple_at_depot"
      },
      "action_uncouple_at_depot": {
        "type": "action",
        "text_ar": "عند الوصول للورشة، أمن القطار بوضع لجام العجل، وافصل خراطيم الهواء يدويًا، وحرر رأس التعشيق لفصل جرار الديزل بنجاح",
        "text_en": "Upon arrival, secure the train with wheel chocks, manually isolate/disconnect air hoses, and release the coupler.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إخلاء وجر القطار المعطل بجرار الديزل لورشة الصيانة بنجاح وفصل الجرار بأمان",
        "text_en": "Disabled train successfully towed to the depot using a diesel locomotive, and uncoupled safely."
      }
    }
  }
];
