import { SOP } from './types';
import { EMERGENCY_SOPS } from './data_emergency';

export const SOPS_DATA: SOP[] = [
  // --- NORMAL SOPS (14 SOPs from official booklet) ---
  {
    sop_code: "DRI-NOR-001",
    category: "normal",
    title_en: "Duty Changeover and Takeover",
    title_ar: "تسليم وتسلم الوردية",
    reference_documents: ["Capital Train Operator Rulebook Section 1.1", "SOPs DRI - Normal Mode Booklet Page 6"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب على قائد القطار البديل التأكد من استلام كابينة مؤمنة والتحقق من سلامة الأقفال والمفاتيح الحرجة.",
        "text_en": "The relieving driver must ensure taking over a secured cab and verify the state of critical safety keys."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "في حالات التشغيل غير العادية، يمنع الاستلام دون تقرير كتابي وتفصيلي معتمد وموقع من قائد القطار السابق.",
        "text_en": "In abnormal operation conditions, handover is prohibited without a signed detailed log from the outgoing driver."
      },
      "S3": {
        "type": "safety_point",
        "text_ar": "إذا لم يتواجد قائد القطار البديل، يجب إبلاغ التحكم المركزي فوراً وعدم ترك الكابينة فارغة تحت أي ظرف.",
        "text_en": "If the relieving driver is absent, notify Central Control immediately and never leave the cab unattended under any circumstance."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "يجب على كلا القائدين التحدث بوضوح وتأكيد تسليم كافة الملاحظات الفنية المسجلة بالرحلة الأخيرة.",
        "text_en": "Both drivers must clearly communicate and confirm all technical logs recorded during the last trip."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يقوم قائد القطار البديل بتسجيل الدخول لبدء استلام الوردية",
        "text_en": "Relieving train driver signs in to start duty takeover.",
        "linked_metadata": ["P1"],
        "next": "q1"
      },
      "q1": {
        "type": "question",
        "text_ar": "هل قائد القطار البديل متواجد داخل الكابينة؟",
        "text_en": "Is the relieving driver present inside the cab?",
        "yes": "action_get_info",
        "no": "action_report_absent"
      },
      "action_report_absent": {
        "type": "action",
        "text_ar": "أبلغ التحكم المركزي OCC فوراً بمخالفة التأخير واتبع التعليمات بدقة دون ترك الكابينة",
        "text_en": "Immediately report the delay to Central Control (OCC) and strictly follow instructions without leaving the cab.",
        "linked_metadata": ["S3"],
        "next": "END"
      },
      "action_get_info": {
        "type": "action",
        "text_ar": "احصل على معلومات التشغيل من قائد القطار الحالي (أية مشاكل فنية، حالة السكة، إخطارات السلامة)",
        "text_en": "Retrieve operational information from the outgoing driver (technical issues, track status, safety notices).",
        "next": "q_abnormal"
      },
      "q_abnormal": {
        "type": "question",
        "text_ar": "هل هناك ظروف أو عوارض تشغيل غير عادية حالية بالقطار؟",
        "text_en": "Are there any current abnormal operating conditions on the train?",
        "yes": "action_abnormal_details",
        "no": "action_check_switches"
      },
      "action_abnormal_details": {
        "type": "action",
        "text_ar": "احصل على تفاصيل العارض والسبب وجميع الإجراءات المتخذة وقرارات مركز التحكم",
        "text_en": "Obtain details of the incident, cause, all actions taken, and CC directives.",
        "linked_metadata": ["S2"],
        "next": "action_check_switches"
      },
      "action_check_switches": {
        "type": "action",
        "text_ar": "تأكد من فهمك لجميع المعلومات بالكامل، ثم تحقق من حالة المفاتيح وبخاصة لوحة التحكم في حالات الطوارئ",
        "text_en": "Ensure complete understanding of all details, then verify the state of switches, especially the emergency panel.",
        "linked_metadata": ["S1"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تسليم وتسلم الوردية وتأمين كابينة القطار بنجاح",
        "text_en": "Duty changeover and cab security completed successfully."
      }
    }
  },
  {
    sop_code: "DRI-NOR-002",
    category: "normal",
    title_en: "Sweep Train",
    title_ar: "قطار الاستكشاف",
    reference_documents: ["Capital Train Operator Rulebook Section 3.4", "SOPs DRI - Normal Mode Booklet Page 10"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "أثناء قيامك بقطار الاستكشاف، يحظر استخدام القيادة الآلية ويجب مراقبة السكة بصرياً باستمرار.",
        "text_en": "During sweep operations, automatic driving is prohibited; the track must be continuously visually monitored."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "يجب الحفاظ على التركيز التام وتجنب أية مشتتات نظراً لاحتمال وجود عوائق على السكة بعد حدوث عارض.",
        "text_en": "Maintain total focus and avoid distractions due to potential track obstacles following an incident."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يصدر التحكم المركزي OCC تعليمات للقيام بقطار استكشاف للتأكد من سلامة السكة عقب عارض أو حادث",
        "text_en": "Central Control (OCC) issues sweep train instructions to verify track integrity after an incident.",
        "linked_metadata": ["P1"],
        "next": "action_drive_manual"
      },
      "action_drive_manual": {
        "type": "action",
        "text_ar": "قم بقيادة القطار بنظام القيادة اليدوية LMD والتزم بحد أقصى للسرعة 60 كم/ساعة والامتثال التام للإشارات",
        "text_en": "Drive the train in manual mode (LMD), adhere to a maximum speed of 60 km/h, and comply with all signals.",
        "linked_metadata": ["S1"],
        "next": "q_obstacle"
      },
      "q_obstacle": {
        "type": "question",
        "text_ar": "هل تم رؤية عائق، سماع صوت غريب، أو الشعور بهزة غير طبيعية تؤثر على القطار؟",
        "text_en": "Was an obstacle spotted, strange sound heard, or abnormal vibration felt?",
        "yes": "action_stop_report",
        "no": "action_continue_sweep"
      },
      "action_stop_report": {
        "type": "action",
        "text_ar": "أوقف القطار فوراً بالكامل، أبلغ مركز التحكم بالموقف الدقيق، وطبق إجراء الطوارئ واتبع تعليماتهم",
        "text_en": "Immediately stop the train, report the exact status to CC, apply the appropriate emergency SOP, and follow directives.",
        "next": "END"
      },
      "action_continue_sweep": {
        "type": "action",
        "text_ar": "استمر بقطار الاستكشاف حتى يبلغك التحكم المركزي بالوصول، ثم أبلغهم بسلامة الخط الرئيسي وجاهزيته لبدء التشغيل",
        "text_en": "Continue sweep until CC confirms arrival, then notify them that the mainline is clear and ready for revenue service.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إكمال قطار الاستكشاف بنجاح والتحقق من سلامة السكة",
        "text_en": "Sweep train completed successfully and track safety verified."
      }
    }
  },
  {
    sop_code: "DRI-NOR-003",
    category: "normal",
    title_en: "Train Un-Stabling",
    title_ar: "إعداد القطار للخروج من منطقة التخزين",
    reference_documents: ["Capital Train Operator Rulebook Section 2.1", "SOPs DRI - Normal Mode Booklet Page 12"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "تأكد من إزالة لجام العجل (Wheel Chocks) تماماً قبل تفعيل طاقة الجر بالقطار لتفادي حدوث خروج عن القضبان.",
        "text_en": "Ensure wheel chocks are fully removed before activating traction power to prevent derailment."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "عند تفعيل البطارية، يجب ألا يقل الجهد عن 92 VDC لضمان استقرار أنظمة التحكم والاتصال بالقطار.",
        "text_en": "Upon battery activation, voltage must not drop below 92 VDC to ensure control and communication stability."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "يجب القيام بالفحص الخارجي للقطار بدقة للتحقق من سلامة صمامات الهواء ومعدات أسفل العربات والزجاج الأمامي.",
        "text_en": "Perform meticulous exterior checks to verify underframe equipment, air valves, and windshield integrity."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يبدأ إعداد القطار من الكابينة الخلفية. اتصل بـ DCC/OCC لطلب تصريح بدء الفحص الخارجي وتجهيز القطار",
        "text_en": "Stabling exit starts at the rear cab. Contact DCC/OCC to request permission for exterior checks and preparation.",
        "linked_metadata": ["P1"],
        "next": "q_lights"
      },
      "q_lights": {
        "type": "question",
        "text_ar": "هل مصابيح الكابينة والإنارة الخارجية مضاءة وتعمل بانتظام؟",
        "text_en": "Are the cab and exterior lights working normally?",
        "yes": "action_exterior_check",
        "no": "action_activate_battery"
      },
      "action_activate_battery": {
        "type": "action",
        "text_ar": "ادخل الكابينة، فعل البطارية (تأكد من الجهد >= 92V)، ثم شغل إنارة الصالون والكابينة وغادرها",
        "text_en": "Enter cab, activate battery (ensure voltage >= 92V), turn on saloon and cab lighting, then exit the cab.",
        "linked_metadata": ["S2"],
        "next": "action_exterior_check"
      },
      "action_exterior_check": {
        "type": "action",
        "text_ar": "قم بفحص اللافتات التحذيرية، والزجاج الأمامي، والنوافذ، والإنارة، والحالة العامة لجانبي القطار وتحت العربات",
        "text_en": "Inspect maintenance warning signs, windshield, windows, lights, and general state of train sides and underframe.",
        "next": "action_remove_chock"
      },
      "action_remove_chock": {
        "type": "action",
        "text_ar": "تحقق من حالة ووجود لجام العجل، وقم بإزالته بالكامل لتأمين حركة القطار",
        "text_en": "Verify the presence of wheel chocks and remove them completely to clear the train path.",
        "linked_metadata": ["S1"],
        "next": "q_abnormal_found"
      },
      "q_abnormal_found": {
        "type": "question",
        "text_ar": "هل تم رصد أي عطل أو وضع غير طبيعي أثناء الفحص الخارجي؟",
        "text_en": "Was any defect or abnormal condition found during the exterior check?",
        "yes": "action_report_failure",
        "no": "action_activate_cab"
      },
      "action_report_failure": {
        "type": "action",
        "text_ar": "أبلغ DCC/OCC فوراً بالمشكلة المكتشفة واتبع تعليمات مشرف الصيانة",
        "text_en": "Immediately report the detected defect to DCC/OCC and follow maintenance supervisor instructions.",
        "next": "END"
      },
      "action_activate_cab": {
        "type": "action",
        "text_ar": "ادخل الكابينة الخلفية وأبلغ DCC بانتهاء الفحص وتلقى تصريح تشغيل القطار. أدخل المفتاح الرئيسي وتأكد من شاشات TCMS و CCTV",
        "text_en": "Enter rear cab, report completed checks to DCC and get activation permit. Insert master key and check TCMS and CCTV screens.",
        "next": "action_panto_brakes"
      },
      "action_panto_brakes": {
        "type": "action",
        "text_ar": "ارفع البانتوغراف، أغلق قاطع التيار VCB، وتحقق من ضغط الهواء والفرامل والأبواب وأنظمة الاتصال الإذاعي",
        "text_en": "Raise pantograph, close VCB, and verify air pressure, brake functions, doors, and radio communication.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم الانتهاء من إعداد القطار وتجهيزه للخروج بنجاح وهو جاهز للتحرك",
        "text_en": "Train un-stabling and preparation completed successfully; train is ready to move."
      }
    }
  },
  {
    sop_code: "DRI-NOR-005",
    category: "normal",
    title_en: "Train Stabling",
    title_ar: "تخزين القطار",
    reference_documents: ["Capital Train Operator Rulebook Section 2.2", "SOPs DRI - Normal Mode Booklet Page 20"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب التحقق من خلو صالون الركاب تماماً عبر كاميرات CCTV والفحص البصري قبل إلغاء تفعيل القطار وتأمينه.",
        "text_en": "Saloon emptiness must be verified via CCTV and visual sweep before deactivating and securing the train."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "تأكد من تثبيت لجام العجل (Wheel Chocks) أسفل عجلات الكابينة الأمامية فور مغادرة القطار لمنع أي دحرجة عشوائية.",
        "text_en": "Ensure wheel chocks are applied under the front cab wheels immediately after exiting to prevent runaway rolling."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "تأكد من إغلاق كافة النوافذ والأبواب الجانبية وتفعيل فرملة الوقوف للحفاظ على سلامة القطار من العوامل الجوية.",
        "text_en": "Ensure all windows and side doors are closed and parking brakes are engaged to secure the train from weather."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يتم إلغاء تفعيل القطار وتخزينه في المنطقة المصرح بها من DCC/OCC",
        "text_en": "Initiate train deactivation and stabling in the authorized yard designated by DCC/OCC.",
        "linked_metadata": ["P1"],
        "next": "action_check_empty"
      },
      "action_check_empty": {
        "type": "action",
        "text_ar": "افحص صالون الركاب عبر كاميرات CCTV للتأكد من نزول جميع الركاب وإغلاق الأبواب والنوافذ بالكامل",
        "text_en": "Inspect the saloon via CCTV to ensure all passengers have egressed and all doors/windows are closed.",
        "linked_metadata": ["S1"],
        "next": "action_deactivate_systems"
      },
      "action_deactivate_systems": {
        "type": "action",
        "text_ar": "ضع يد التحكم على وضع الحياد ومفتاح تحديد اتجاه المسير على صفر (0)، وافتح قاطع التيار VCB واخفض البانتوغراف وتأكد عبر TCMS",
        "text_en": "Put master controller to neutral, direction key to zero (0), open VCB, lower pantograph and verify via TCMS.",
        "next": "q_switches_normal"
      },
      "q_switches_normal": {
        "type": "question",
        "text_ar": "هل جميع المفاتيح والقواطع الكهربائية في وضعها الطبيعي؟",
        "text_en": "Are all electric switches and breakers in their normal positions?",
        "yes": "action_secure_cabs",
        "no": "action_report_dcc_fault"
      },
      "action_report_dcc_fault": {
        "type": "action",
        "text_ar": "أبلغ DCC فوراً بالوضع غير الطبيعي وتابع معهم واتبع التوجيهات لتفادي الأعطال بالوردية القادمة",
        "text_en": "Immediately report the abnormal state to DCC, coordinate with them and follow guidelines.",
        "next": "action_secure_cabs"
      },
      "action_secure_cabs": {
        "type": "action",
        "text_ar": "أغلق الكابينة الحالية، توجه للكابينة الأخرى وتأكد من تأمينها وفصل البطاريات، ثم اخرج من القطار",
        "text_en": "Secure current cab, walk to the other cab, verify security, turn off batteries, then exit the train.",
        "next": "action_apply_chock"
      },
      "action_apply_chock": {
        "type": "action",
        "text_ar": "قم بتثبيت لجام العجل أسفل عجلات الكابينة الأمامية وأبلغ DCC/OCC بنجاح تخزين القطار وتأمينه",
        "text_en": "Apply wheel chocks under the front cab wheels and notify DCC/OCC of successful stabling and security.",
        "linked_metadata": ["S2"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تخزين القطار بالكامل وتأمينه بنجاح بنهاية الوردية",
        "text_en": "Train stabling and shutdown successfully completed."
      }
    }
  },
  {
    sop_code: "DRI-NOR-006",
    category: "normal",
    title_en: "Changing Train Cabins",
    title_ar: "تغيير كابينة القيادة",
    reference_documents: ["Capital Train Operator Rulebook Section 2.3", "SOPs DRI - Normal Mode Booklet Page 23"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "تأكد من تفعيل فرملة الانتظار (Holding Brake) بالكامل وإضاءة لمبة ربط الانتظار قبل إيقاف تفعيل الكابينة الحالية.",
        "text_en": "Ensure holding brake is fully applied and its indicator is illuminated before deactivating the current cab."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "أثناء عبورك لصالون الركاب للكابينة الأخرى، تفقد الصالون بصرياً للتأكد من سلامته وخلوه من أية مفقودات أو أجسام مشبوهة.",
        "text_en": "While walking through the saloon to the other cab, visually inspect for safety, missing items, or suspicious objects."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يبدأ الإجراء عند رصيف المحطة لتغيير اتجاه مسير القطار",
        "text_en": "Initiate procedure at the station platform to change the train direction of travel.",
        "linked_metadata": ["P1"],
        "next": "q_has_passengers"
      },
      "q_has_passengers": {
        "type": "question",
        "text_ar": "هل يوجد ركاب حالياً على متن القطار أو على الرصيف؟",
        "text_en": "Are there passengers currently on board or on the platform?",
        "yes": "action_open_sides",
        "no": "action_apply_holding_brake"
      },
      "action_open_sides": {
        "type": "action",
        "text_ar": "حدد اتجاه فتح الأبواب وافتحها للسماح للركاب بالدخول والخروج بأمان",
        "text_en": "Select correct platform door side and open them to allow passengers safe boarding and egress.",
        "next": "action_apply_holding_brake"
      },
      "action_apply_holding_brake": {
        "type": "action",
        "text_ar": "قم بتطبيق فرملة الانتظار وتأكد من إضاءة لمبة الربط على لوحة القيادة",
        "text_en": "Apply the holding brake and confirm that the holding brake indicator is lit on the console.",
        "linked_metadata": ["S1"],
        "next": "action_key_off"
      },
      "action_key_off": {
        "type": "action",
        "text_ar": "ضع يد التحكم على وضع الحياد، ومفتاح الاتجاه على صفر، ثم أدر المفتاح الرئيسي إلى OFF واسحبه معك",
        "text_en": "Set controller to neutral, direction key to zero, turn master key to OFF and remove it.",
        "next": "action_secure_exit"
      },
      "action_secure_exit": {
        "type": "action",
        "text_ar": "أغلق نوافذ وأبواب الكابينة الحالية، ثم غادرها وتأكد من إغلاق بابها وتوجه عبر الصالون للكابينة الأخرى",
        "text_en": "Close windows and doors of current cab, exit, ensure cab door is locked, and walk through the saloon to the other cab.",
        "next": "action_activate_new_cab"
      },
      "action_activate_new_cab": {
        "type": "action",
        "text_ar": "ادخل الكابينة الجديدة، تأكد من سلامة طفاية الحريق، أدخل المفتاح الرئيسي وأدره لوضع ON وتحقق من شاشة TCMS",
        "text_en": "Enter the new cab, verify fire extinguisher integrity, insert master key and turn to ON, and verify TCMS startup.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تغيير كابينة القيادة بنجاح والقطار جاهز للانطلاق في الاتجاه المعاكس",
        "text_en": "Train cab change completed successfully; train is ready for departure in the opposite direction."
      }
    }
  },
  {
    sop_code: "DRI-NOR-007",
    category: "normal",
    title_en: "Train Driver Leaving the Cab Temporarily",
    title_ar: "مغادرة قائد القطار للكابينة مؤقتاً",
    reference_documents: ["Capital Train Operator Rulebook Section 1.5", "SOPs DRI - Normal Mode Booklet Page 26"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب غلق كافة نوافذ الكابينة وتربيس باب الكابينة لمنع دخول الركاب أو العبث بالأجهزة عند مغادرتك.",
        "text_en": "All cab windows must be closed and the cab door secured to prevent unauthorized access or tampering while away."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "خذ معك دائماً جهاز اللاسلكي المحمول لضمان استمرار التواصل المباشر مع مركز التحكم OCC.",
        "text_en": "Always carry your portable wireless handset to ensure continuous direct communication with OCC."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يتطلب الموقف مغادرة قائد القطار للكابينة لفحص عارض أو لسبب طارئ",
        "text_en": "Situation requires the train driver to temporarily leave the cab for troubleshooting or emergency checks.",
        "linked_metadata": ["P1"],
        "next": "action_report_occ_permit"
      },
      "action_report_occ_permit": {
        "type": "action",
        "text_ar": "اتصل بالتحكم المركزي OCC لإبلاغهم بالموقع والسبب بالتفصيل واطلب الحصول على تصريح للمغادرة",
        "text_en": "Contact OCC to report location, specific reason, and request permission to temporarily leave the cab.",
        "next": "action_apply_parking_brakes"
      },
      "action_apply_parking_brakes": {
        "type": "action",
        "text_ar": "تأكد من وقوف القطار بالكامل، طبق ربط الانتظار وضع يد التحكم على الحياد، ومفتاح تحديد الاتجاه على صفر",
        "text_en": "Ensure train is completely stopped, apply holding brake, set controller to neutral, and direction key to zero.",
        "next": "q_is_at_platform"
      },
      "q_is_at_platform": {
        "type": "question",
        "text_ar": "هل يتواجد القطار حالياً بمحاذاة رصيف المحطة؟",
        "text_en": "Is the train currently aligned at a station platform?",
        "yes": "action_open_platform_doors",
        "no": "action_turn_off_master_key"
      },
      "action_open_platform_doors": {
        "type": "action",
        "text_ar": "افتح أبواب القطار بالجهة المحاذية للرصيف للسلامة، وقم بإصدار إعلان طمأنة للركاب عبر الإذاعة الداخلية",
        "text_en": "Open doors on the platform side for safety, and broadcast a reassurance announcement to passengers via PA.",
        "next": "action_turn_off_master_key"
      },
      "action_turn_off_master_key": {
        "type": "action",
        "text_ar": "أدر المفتاح الرئيسي إلى وضع OFF واسحبه معك مع مفتاح الكابينة والمفتاح المربع واللاسلكي",
        "text_en": "Turn master key to OFF and remove it. Keep it with you along with cab key, square key, and wireless handset.",
        "next": "action_lock_cab_secure"
      },
      "action_lock_cab_secure": {
        "type": "action",
        "text_ar": "أغلق جميع النوافذ، وتربس باب الكابينة جيداً لمنع تسلل أي شخص، ثم غادر لتأدية المهمة",
        "text_en": "Close all windows, lock the cab door securely to prevent entry, then leave to perform your task.",
        "linked_metadata": ["S1"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تأمين كابينة القيادة ومغادرتها مؤقتاً بأمان بموافقة مركز التحكم",
        "text_en": "Cab secured and temporarily left safely with OCC authorization."
      }
    }
  },
  {
    sop_code: "DRI-NOR-008",
    category: "normal",
    title_en: "Start of the Revenue Service",
    title_ar: "بدء الخدمة",
    reference_documents: ["Capital Train Operator Rulebook Section 2.4", "SOPs DRI - Normal Mode Booklet Page 29"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "قبل التوجه للخط الرئيسي، تأكد من تسلم إشعارات السلامة والتوقيع على نموذج فحص اليومية وأخذ تصريح DCC.",
        "text_en": "Before moving to mainline, verify signing the daily safety alerts sheet and obtaining DCC exit permit."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "تأكد من تفعيل الاتصال الإذاعي الداخلي والخارجي ومراجعة مؤشرات لوحة القيادة بالكامل.",
        "text_en": "Ensure wired/wireless communication systems are tested and dashboard indicators are verified."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يبدأ قائد القطار بتجهيز نفسه واستلام القطار من الورشة أو بالمسير من الزميل للبدء بالخدمة التجارية",
        "text_en": "Driver prepares to take over the train set from depot or mid-track to begin revenue service.",
        "linked_metadata": ["P1"],
        "next": "action_verify_docs"
      },
      "action_verify_docs": {
        "type": "action",
        "text_ar": "راجع ووقع على إشعارات السلامة ودفتر الفحص اليومي وأوراق القطار المعتمدة",
        "text_en": "Review and sign the daily safety alerts, inspection log, and approved train paperwork.",
        "linked_metadata": ["S1"],
        "next": "action_request_exit"
      },
      "action_request_exit": {
        "type": "action",
        "text_ar": "اطلب تصريح الخروج وتأكيد وجهة المسير نحو الخط الرئيسي من DCC أو من التحكم بمحطة الورشة",
        "text_en": "Request exit permit and track alignment confirmation towards the mainline from DCC or yard tower.",
        "next": "action_drive_and_connect"
      },
      "action_drive_and_connect": {
        "type": "action",
        "text_ar": "قد القطار بالسرعات المحددة، وعند الوصول للخط الرئيسي اتصل بـ OCC لإعلامهم بالجاهزية للخدمة التجارية",
        "text_en": "Drive the train within limits, and upon reaching mainline, contact OCC to report service readiness.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم دخول القطار للخط الرئيسي بنجاح وبدء الرحلة التجارية بالركاب",
        "text_en": "Train entered mainline successfully and revenue service started."
      }
    }
  },
  {
    sop_code: "DRI-NOR-009",
    category: "normal",
    title_en: "End of the Revenue Service",
    title_ar: "نهاية الخدمة",
    reference_documents: ["Capital Train Operator Rulebook Section 2.5", "SOPs DRI - Normal Mode Booklet Page 31"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يمنع توجيه القطار للتخزين أو الورشة إلا بعد التأكد الكامل من نزول آخر راكب وخلو صالونات الركاب.",
        "text_en": "It is prohibited to move the train for stabling or depot before ensuring all passengers have egressed."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "قم بإصدار إعلانات متكررة عبر الإذاعة الداخلية للركاب تفيد بانتهاء رحلة القطار في المحطة الحالية.",
        "text_en": "Make repeated passenger announcements via PA stating that the train is completing its service."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يصدر التحكم المركزي OCC أمراً بانتهاء رحلة القطار التجارية الأخيرة والتوجه للتخزين",
        "text_en": "Central Control (OCC) issues orders to end the last revenue trip and proceed to stabling.",
        "linked_metadata": ["P1"],
        "next": "action_announce_passengers"
      },
      "action_announce_passengers": {
        "type": "action",
        "text_ar": "قم بإصدار إذاعات داخلية متكررة للركاب تفيد بنهاية الخدمة في هذه المحطة ومغادرة القطار بالكامل",
        "text_en": "Broadcast repeated announcements stating the end of service and requesting all passengers to exit.",
        "next": "action_confirm_saloon_empty"
      },
      "action_confirm_saloon_empty": {
        "type": "action",
        "text_ar": "تأكد من نزول جميع الركاب وخلو القطار بصرياً وعبر شاشات CCTV، وتأكد من خلوه من المفقودات",
        "text_en": "Verify all passengers have left and saloon is empty via visual inspection and CCTV screens.",
        "linked_metadata": ["S1"],
        "next": "action_request_stabling_path"
      },
      "action_request_stabling_path": {
        "type": "action",
        "text_ar": "اتصل بـ OCC واطلب تصريح الحركة ووجهة مسار التخزين (سكة التخزين أو سكة الورشة)",
        "text_en": "Contact OCC and request movement authority and stabling destination (stabling siding or depot).",
        "next": "action_execute_stabling_sop"
      },
      "action_execute_stabling_sop": {
        "type": "action",
        "text_ar": "قد القطار إلى السكة المحددة ونفذ خطوات تخزين وإلغاء تفعيل القطار بالكامل (Stabling SOP)",
        "text_en": "Drive the train to the designated siding and execute the full stabling and shutdown procedure.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إنهاء الخدمة التجارية وتخزين القطار وتأمينه بنجاح",
        "text_en": "Revenue service completed and train safely stabled and secured."
      }
    }
  },
  {
    sop_code: "DRI-NOR-010",
    category: "normal",
    title_en: "Train Entering Depot Area",
    title_ar: "دخول القطار لمنطقة الورشة",
    reference_documents: ["Capital Train Operator Rulebook Section 2.6", "SOPs DRI - Normal Mode Booklet Page 33"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "الحد الأقصى للسرعة في منطقة الورشة هو 20 كم/ساعة ويجب تفعيل مفتاح حد السرعة CMD20.",
        "text_en": "The maximum speed inside the depot is 20 km/h; the speed bypass switch CMD20 must be active."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "انتبه بشدة لإشارات المناورة الأرضية وحركة القاطرات والعاملين على القضبان داخل منطقة الورشة.",
        "text_en": "Pay close attention to ground shunting signals, other train sets, and track personnel inside the depot yard."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يقترب القطار من سكة الدخول المؤدية لمنطقة الورشة (Depot) قادماً من الخط الرئيسي",
        "text_en": "Train approaches the depot entrance track coming from the mainline.",
        "linked_metadata": ["P1"],
        "next": "action_contact_dcc"
      },
      "action_contact_dcc": {
        "type": "action",
        "text_ar": "اتصل ببرج التحكم بالورشة DCC للحصول على تصريح بالدخول وتأكيد رقم سكة التوجيه المخصصة للقطار",
        "text_en": "Contact the depot control tower (DCC) to obtain entrance clearance and confirm the designated track number.",
        "next": "action_enable_cmd20"
      },
      "action_enable_cmd20": {
        "type": "action",
        "text_ar": "تأكد من أن مفتاح CMD على الوضع CMD20 في لوحة تحكم الطوارئ لمنع تجاوز سرعة الورشة",
        "text_en": "Ensure that the CMD bypass switch is set to CMD20 on the emergency panel to prevent overspeeding.",
        "linked_metadata": ["S1"],
        "next": "action_drive_lmd_depot"
      },
      "action_drive_lmd_depot": {
        "type": "action",
        "text_ar": "قد القطار بنظام القيادة اليدوية LMD بسرعة لا تتعدى 20 كم/ساعة، وراقب بمسيرك التحاويل الأرضية",
        "text_en": "Drive the train in manual mode (LMD) at a speed not exceeding 20 km/h, and closely watch shunting switches.",
        "next": "action_park_depot_track"
      },
      "action_park_depot_track": {
        "type": "action",
        "text_ar": "أوقف القطار تماماً على السكة المحددة بالورشة، وأبلغ DCC بالوصول لتأمين القطار واستلام التخزين",
        "text_en": "Stop the train completely on the designated track, and report arrival to DCC to secure the train.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم دخول القطار منطقة الورشة وتأمينه على السكة المخصصة بنجاح",
        "text_en": "Train successfully entered the depot and parked on the designated track."
      }
    }
  },
  {
    sop_code: "DRI-NOR-011",
    category: "normal",
    title_en: "Train Leaving Depot area",
    title_ar: "مغادرة القطار لمنطقة الورشة",
    reference_documents: ["Capital Train Operator Rulebook Section 2.7", "SOPs DRI - Normal Mode Booklet Page 35"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب مراعاة تعليمات إشارات التحاويل بمسار الورشة وعدم تجاوز أية إشارة حمراء إلا بأمر مكتوب وتصريح رسمي.",
        "text_en": "Observe all depot shunting signals; bypassing a red signal is strictly forbidden without written permission."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "تأكد من إكمال إجراءات تجهيز القطار وفحصه بالكامل (Un-Stabling SOP) قبل المغادرة بالورشة.",
        "text_en": "Ensure the complete un-stabling and preparation procedure is done before leaving the depot."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يستعد قائد القطار بالمغادرة من الورشة والتوجه للخط الرئيسي لتفعيل الخدمة التجارية",
        "text_en": "Driver prepares to exit the depot towards the mainline to initiate revenue service.",
        "linked_metadata": ["P1"],
        "next": "action_request_dcc_exit_route"
      },
      "action_request_dcc_exit_route": {
        "type": "action",
        "text_ar": "اتصل بـ DCC للحصول على تصريح الخروج والسرعة ومسار التحرك نحو نقطة الربط مع الخط الرئيسي",
        "text_en": "Contact DCC to obtain exit authorization, speed limit, and alignment route towards the mainline connection.",
        "linked_metadata": ["S1"],
        "next": "action_drive_to_mainline"
      },
      "action_drive_to_mainline": {
        "type": "action",
        "text_ar": "قد القطار بنظام LMD بسرعة أقل من 20 كم/ساعة منتبهًا للإشارات الأرضية، حتى الوصول لنقطة الربط",
        "text_en": "Drive the train in LMD mode under 20 km/h, watching ground signals, until reaching the connection point.",
        "next": "action_switch_cbtc"
      },
      "action_switch_cbtc": {
        "type": "action",
        "text_ar": "عند نقطة الربط، قم بتحويل نظام القيادة لنظام CBTC-LMD لتسليم التحكم لنظام التحكم التلقائي للخط الرئيسي",
        "text_en": "At the connection point, switch the driving system to CBTC-LMD to hand over control to the mainline automatic system.",
        "next": "action_report_occ_mainline"
      },
      "action_report_occ_mainline": {
        "type": "action",
        "text_ar": "أبلغ التحكم المركزي OCC بالدخول للخط الرئيسي والجاهزية لبدء الرحلة التجارية واستقبال الركاب",
        "text_en": "Notify OCC of entering the mainline and being ready to start the revenue trip and accept passengers.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم الخروج من الورشة والاتصال بـ OCC وبدء الخدمة على الخط الرئيسي بنجاح",
        "text_en": "Exit from depot completed; OCC contacted and mainline service started successfully."
      }
    }
  },
  {
    sop_code: "DRI-NOR-012",
    category: "normal",
    title_en: "Train Washing (Badr)",
    title_ar: "غسيل القطار في الورشة (بدر)",
    reference_documents: ["Capital Train Operator Rulebook Section 2.8", "SOPs DRI - Normal Mode Booklet Page 37"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب إغلاق جميع نوافذ الكابينات والصالون بالكامل لمنع تسرب المياه، وإيقاف نظام التكييف تماماً وتفعيل وضع الغسيل.",
        "text_en": "All cab and saloon windows must be fully closed to prevent water leakage, HVAC turned off, and Wash Mode enabled."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "يجب السير داخل المغسلة الآلية بسرعة ثابتة وبطيئة جداً تتراوح بين 3 و 5 كم/ساعة فقط.",
        "text_en": "Maintain a steady, very slow speed between 3 and 5 km/h inside the automatic wash plant."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يتوجه قائد القطار بالقطار إلى مغسلة القطارات الآلية بورشة بدر بالتنسيق التام مع DCC",
        "text_en": "Driver proceeds with the train to the automatic train wash plant in Badr depot as coordinated with DCC.",
        "next": "action_stop_before_wash"
      },
      "action_stop_before_wash": {
        "type": "action",
        "text_ar": "توقف بالقطار على مسافة 1 متر تقريباً قبل لافتة 'Prepare for Washing' الإرشادية بمقدمة المغسلة",
        "text_en": "Stop the train approximately 1 meter before the 'Prepare for Washing' indicator board at the entrance.",
        "next": "action_close_and_prep"
      },
      "action_close_and_prep": {
        "type": "action",
        "text_ar": "تأكد من إغلاق النوافذ، وإيقاف المكيفات، ورفع البانتوغراف، وتفعيل وضع 'Washing Mode' ومساحات الزجاج",
        "text_en": "Ensure all windows are closed, HVAC is off, pantograph is raised, and 'Washing Mode' and wipers are active.",
        "linked_metadata": ["S1"],
        "next": "action_drive_wash_speed"
      },
      "action_drive_wash_speed": {
        "type": "action",
        "text_ar": "تحرك ببطء شديد وبسرعة ثابتة بين 3 إلى 5 كم/ساعة داخل المغسلة لضمان غسيل آمن وجيد للقطار",
        "text_en": "Drive very slowly at a steady speed of 3 to 5 km/h inside the washing plant for safe and efficient cleaning.",
        "linked_metadata": ["P1"],
        "next": "q_wash_finished"
      },
      "q_wash_finished": {
        "type": "question",
        "text_ar": "هل ظهرت لافتة 'Finish Washing' الخضراء وعبر القطار المغسلة بالكامل؟",
        "text_en": "Has the green 'Finish Washing' board illuminated and the train fully crossed the wash plant?",
        "yes": "action_exit_wash_restore",
        "no": "action_drive_wash_speed"
      },
      "action_exit_wash_restore": {
        "type": "action",
        "text_ar": "أوقف القطار تماماً بعد عبور المغسلة، قم بإلغاء 'Washing Mode'، أعد تشغيل المكيفات والمساحات للوضع الطبيعي وأبلغ DCC",
        "text_en": "Stop the train completely after exiting, disable 'Washing Mode', restore HVAC and wipers to normal, and notify DCC.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم الانتهاء من غسيل القطار واستعادة كافة الأنظمة وجاهز للحركة",
        "text_en": "Train washing completed and all systems restored successfully."
      }
    }
  },
  {
    sop_code: "DRI-NOR-013",
    category: "normal",
    title_en: "Train Coupling/Uncoupling",
    title_ar: "ضم أو فصل القطارات في الورشة",
    reference_documents: ["Capital Train Operator Rulebook Section 2.9", "SOPs DRI - Normal Mode Booklet Page 41"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "عند إجراء الضم، يجب ألا تتجاوز السرعة 2 كم/ساعة لتفادي الاصطدامات العنيفة وتضرر الرأس الآلي (Coupler).",
        "text_en": "During coupling, approach speed must not exceed 2 km/h to prevent hard impact and coupler damage."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "تأكد من تأمين فرملة الطوارئ للقطار الثابت بالكامل قبل البدء في الاقتراب والضم الميكانيكي.",
        "text_en": "Ensure full emergency brake is applied on the stationary train set before initiating coupling."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يتلقى قائد القطار تعليمات بضم قطارين لزيادة السعة أو لفصل قطار معطل في الورشة بالتنسيق مع DCC",
        "text_en": "Driver receives orders to perform coupling to double capacity or uncouple a defective train in the depot.",
        "next": "action_confirm_dcc_shunting"
      },
      "action_confirm_dcc_shunting": {
        "type": "action",
        "text_ar": "اتصل بـ DCC واطلب تصريح المناورة وتأكيد أرقام القطارات ومسار السكة للضم أو الفصل",
        "text_en": "Contact DCC to obtain shunting authorization and confirm train numbers and track path.",
        "next": "q_is_coupling_proc"
      },
      "q_is_coupling_proc": {
        "type": "question",
        "text_ar": "هل الإجراء المطلوب هو 'ضم قطارات' (Coupling)؟",
        "text_en": "Is the required procedure 'Coupling' of train sets?",
        "yes": "action_coupling_steps",
        "no": "action_uncoupling_steps"
      },
      "action_coupling_steps": {
        "type": "action",
        "text_ar": "قد القطار ببطء شديد (أقل من 2 كم/س) نحو القطار الثابت، حتى إتمام الضم الميكانيكي والكهربائي وتأكيده بشاشة TCMS",
        "text_en": "Drive train extremely slowly (under 2 km/h) towards stationary set, until mechanical/electrical coupling is locked and confirmed via TCMS.",
        "linked_metadata": ["S1", "P1"],
        "next": "action_test_coupled_brakes"
      },
      "action_test_coupled_brakes": {
        "type": "action",
        "text_ar": "أجرِ اختبار الفرامل المشترك والتحكم والاتصالات للتأكد من ربط القطارين وسلامة التوصيلات الكهربائية بينهما",
        "text_en": "Perform joint brake, traction, and communication tests to verify full connection integrity of both train sets.",
        "next": "END"
      },
      "action_uncoupling_steps": {
        "type": "action",
        "text_ar": "فعل فرملة الطوارئ للقطار المراد فصله، حرر قفل الرأس الآلي عبر الكابينة أو يدوياً، وتحرك ببطء للخلف للفصل التام",
        "text_en": "Apply emergency brake on the set to be separated, release the coupler lock via cab or manually, and slowly back away.",
        "next": "action_confirm_separated"
      },
      "action_confirm_separated": {
        "type": "action",
        "text_ar": "أبلغ DCC بإتمام عملية الفصل وتأمين استقرار كل قطار على حدة على القضبان",
        "text_en": "Report successful uncoupling to DCC and confirm safe stationary status of both sets on the tracks.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إكمال عملية الضم/الفصل وتأمين القطارات بنجاح",
        "text_en": "Coupling/uncoupling operation completed and train sets safely secured."
      }
    }
  },
  {
    sop_code: "DRI-NOR-014",
    category: "normal",
    title_en: "Train on stand-by",
    title_ar: "القطار في وضع الاستعداد",
    reference_documents: ["Capital Train Operator Rulebook Section 2.10", "SOPs DRI - Normal Mode Booklet Page 50"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب مراقبة شاشة TCMS وأجهزة الاتصال باستمرار والتأهب للانطلاق فوراً بمجرد صدور أمر التحرك من OCC.",
        "text_en": "Monitor TCMS and communication radios continuously and prepare to depart immediately upon OCC command."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "تأكد من بقاء البانتوغراف مرفوعاً ونظام VCB مغلقاً لضمان تشغيل تكييف الهواء والإنارة لصالونات الركاب.",
        "text_en": "Ensure pantograph remains raised and VCB is closed to maintain saloon HVAC and lighting operations."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يصدر توجيه من التحكم المركزي OCC بوضع القطار في حالة الاستعداد (Standby) على سكة جانبية للطوارئ",
        "text_en": "OCC issues directives to put the train on stand-by status on an emergency siding.",
        "next": "action_park_standby"
      },
      "action_park_standby": {
        "type": "action",
        "text_ar": "أوقف القطار بالكامل على السكة المحددة، وضع يد التحكم على الحياد ومفتاح تحديد اتجاه المسير على صفر (0)",
        "text_en": "Stop train completely on designated siding, set controller to neutral and direction key to zero (0).",
        "next": "action_verify_empty_standby"
      },
      "action_verify_empty_standby": {
        "type": "action",
        "text_ar": "تأكد من خلو صالون الركاب تماماً عبر كاميرات CCTV وأغلق جميع الأبواب والنوافذ لتجنب دخول أي شخص",
        "text_en": "Verify the saloon is completely empty via CCTV and close all doors and windows to prevent entry.",
        "next": "action_keep_active_systems"
      },
      "action_keep_active_systems": {
        "type": "action",
        "text_ar": "أبقِ البانتوغراف مرفوعاً وقاطع VCB مغلقاً لضمان تكييف الهواء وجاهزية القطار للإقلاع الفوري عند الطلب",
        "text_en": "Keep pantograph raised and VCB closed to maintain HVAC and full readiness for immediate departure.",
        "linked_metadata": ["P1"],
        "next": "action_continuous_monitor"
      },
      "action_continuous_monitor": {
        "type": "action",
        "text_ar": "تابع شاشة TCMS وأجهزة الاتصال الإذاعي بانتظام بانتظار تعليمات الانطلاق الفوري من OCC",
        "text_en": "Monitor TCMS screen and radio communications regularly, awaiting immediate departure instructions from OCC.",
        "linked_metadata": ["S1"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "القطار في وضع الاستعداد التام وجاهز للانطلاق فوراً عند إبلاغك بذلك",
        "text_en": "Train is fully on stand-by and prepared to depart immediately upon OCC order."
      }
    }
  },
  {
    sop_code: "DRI-NOR-017",
    category: "normal",
    title_en: "Train Customers Exchange",
    title_ar: "صعود ونزول الركاب من القطار",
    reference_documents: ["Capital Train Operator Rulebook Section 1.7", "SOPs DRI - Normal Mode Booklet Page 52"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "تأكد من وقوف القطار بالكامل وإضاءة مؤشر المحاذاة الأخضر (Stop Board) قبل الضغط على أزرار فتح الأبواب.",
        "text_en": "Ensure train is completely stopped and the green alignment (Stop Board) indicator is lit before opening doors."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "قبل غلق الأبواب، راقب الرصيف والمرايا الجانبية وشاشات CCTV للتأكد من عدم وجود ركاب في حيز الأبواب.",
        "text_en": "Before closing doors, monitor the platform, side mirrors, and CCTV to ensure no passengers are in the door path."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "قم بإصدار نغمة الإشعار الصوتي للتحذير عبر مكبرات الصوت قبل بدء غلق الأبواب لتنبيه الركاب.",
        "text_en": "Broadcast the audible door-closing warning tone via the PA speaker before initiating door closure."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يتوقف القطار بالكامل في المحطة بمحاذاة الرصيف للقيام بعملية تبادل وصعود الركاب",
        "text_en": "Train stops completely at the station platform for passenger exchange.",
        "next": "action_confirm_alignment"
      },
      "action_confirm_alignment": {
        "type": "action",
        "text_ar": "تحقق من وقوف القطار بالكامل وإضاءة مؤشر المحاذاة الأخضر (Stop Board) بدقة لضمان محاذاة أبواب الرصيف",
        "text_en": "Verify that the train is completely stopped and the green alignment (Stop Board) indicator is active for platform door alignment.",
        "linked_metadata": ["S1"],
        "next": "action_open_exchange_doors"
      },
      "action_open_exchange_doors": {
        "type": "action",
        "text_ar": "حدد الجانب الصحيح للرصيف، واضغط على أزرار الفتح لتفتيح أبواب القطار وأبواب رصيف المحطة معاً",
        "text_en": "Select the correct platform side, and press the open buttons to open both train and platform doors simultaneously.",
        "next": "action_monitor_passengers"
      },
      "action_monitor_passengers": {
        "type": "action",
        "text_ar": "راقب صعود ونزول الركاب عبر مرايا الرؤية الجانبية وشاشات CCTV للتأكد من سلامة عملية التبادل",
        "text_en": "Monitor passenger boarding and egress via side mirrors and CCTV screens to ensure safe exchange.",
        "next": "q_exchange_completed"
      },
      "q_exchange_completed": {
        "type": "question",
        "text_ar": "هل انتهى تبادل الركاب وتم إخلاء حيز الأبواب بالكامل على الرصيف؟",
        "text_en": "Has passenger exchange finished and are all door areas clear?",
        "yes": "action_close_exchange_doors",
        "no": "action_warn_passengers_pa"
      },
      "action_warn_passengers_pa": {
        "type": "action",
        "text_ar": "قم بإصدار نغمة التحذير الإذاعية لإشعار الركاب ببدء غلق الأبواب لمنع الازدحام",
        "text_en": "Broadcast the warning tone via PA to notify passengers that doors are closing to prevent crowding.",
        "linked_metadata": ["P1"],
        "next": "action_monitor_passengers"
      },
      "action_close_exchange_doors": {
        "type": "action",
        "text_ar": "اضغط على أزرار الغلق، وتأكد عبر شاشة TCMS واللمبات التوضيحية من الإغلاق التام لكافة الأبواب بالقطار والرصيف",
        "text_en": "Press the close buttons, and verify via TCMS and console lamps that all train and platform doors are fully closed.",
        "linked_metadata": ["S2"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إتمام عملية تبادل الركاب وتأمين الأبواب بنجاح والقطار جاهز للانطلاق",
        "text_en": "Passenger exchange completed, doors secured, and train is ready for departure."
      }
    }
  },

  // --- DEGRADED SOPS (Comprehensive 15 Degraded SOPs from official booklet) ---
  {
    sop_code: "DRI-DEG-103",
    category: "degraded",
    title_en: "On Board Radio System Failure",
    title_ar: "عطل نظام الراديو على متن القطار",
    reference_documents: ["Capital Train Operator Rulebook Section 4.1", "SOPs DRI - Degraded Mode Page 6"],
    metadata: {
      "P1": {
        "type": "point_of_attention",
        "text_ar": "لا يعتبر عطل نظام الراديو حالة طارئة تمنع القطار من استئناف الخدمة، وبالتالي وفقاً لقرار التحكم المركزي، يمكن للقطار استكمال الرحلة أو خروجه من الخدمة وإرساله إلى الورشة.",
        "text_en": "On-board radio system failure is NOT considered an urgent emergency that prevents resuming service. According to Central Control's decision, the train may continue the trip or be withdrawn from service and dispatched to the depot."
      },
      "S1": {
        "type": "safety_point",
        "text_ar": "لاستخدام هاتف الإشارة المتواجد على الرصيف أو هاتف الطوارئ الملحق بالإشارات، سيقوم قائد القطار بمغادرة الكابينة بعد اتخاذ جميع تدابير السلامة لمغادرة الكابينة. إذا كان القطار بين محطتين، سيجد أقرب هاتف طوارئ ملحق بالإشارة. وإذا كان القطار متواجداً على الرصيف، فيمكنه استخدام هاتف الرصيف أسفل شاشة DTI.",
        "text_en": "To use the platform signal phone or the signal-mounted emergency phone, the driver must exit the cab after taking all safety measures. If between stations, find the nearest signal-attached emergency phone. If at platform, use the platform phone under the DTI screen."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يكتشف قائد القطار مشكلة أو تم إبلاغه بوجود عطل في نظام الراديو الموجود على متن القطار",
        "text_en": "Train Driver detects a problem or is notified of an on-board radio system failure.",
        "linked_metadata": ["P1"],
        "next": "q_handset_works"
      },
      "q_handset_works": {
        "type": "question",
        "text_ar": "هل جهاز اللاسلكي المحمول يعمل؟",
        "text_en": "Is the portable wireless handset working?",
        "yes": "action_wireless_ok",
        "no": "action_wireless_failed"
      },
      "action_wireless_failed": {
        "type": "action",
        "text_ar": "عند توقف القطار تماماً، استخدم أقرب هاتف إشارات متاح لإبلاغ مركز التحكم بعطل الراديو",
        "text_en": "Once the train is safely stopped, use the nearest available signal phone to report the radio failure to the Control Center.",
        "linked_metadata": ["S1"],
        "next": "follow_cc_end"
      },
      "action_wireless_ok": {
        "type": "action",
        "text_ar": "اتصل بالتحكم المركزي باللاسلكي وأعد ضبط الراديو من خلال زر التشغيل/الإيقاف ON/OFF ثم حاول الاتصال بالراديو",
        "text_en": "Contact Central Control via wireless, reset the radio using the ON/OFF button, and try communicating via the main radio.",
        "next": "q_reset_success"
      },
      "q_reset_success": {
        "type": "question",
        "text_ar": "هل يعمل الراديو بشكل طبيعي بعد إعادة الضبط؟",
        "text_en": "Is the radio working normally after the reset?",
        "yes": "follow_cc_end",
        "no": "action_reset_failed"
      },
      "action_reset_failed": {
        "type": "action",
        "text_ar": "اتصل بالتحكم المركزي باللاسلكي واستأنف الرحلة للمحطة النهائية، واطلب صيانة عند الوصول لتصليح العطل",
        "text_en": "Contact Central Control via wireless, resume the trip to the terminal, and request maintenance upon arrival.",
        "next": "follow_cc_end"
      },
      "follow_cc_end": {
        "type": "action",
        "text_ar": "اتبع تعليمات التحكم المركزي واستكمل المسير بحذر وفق التوجيهات",
        "text_en": "Follow Central Control instructions and proceed carefully as directed.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تنفيذ الإجراء وتأمين الاتصال والمتابعة مع مركز التحكم بنجاح",
        "text_en": "Procedure executed, communication secured, and monitoring active."
      }
    }
  },
  {
    sop_code: "DRI-DEG-105",
    category: "degraded",
    title_en: "Provisional Service & Temporary Single Track",
    title_ar: "التدوير وخط مفرد مؤقت",
    reference_documents: ["Capital Train Operator Rulebook Section 4.2", "SOPs DRI - Degraded Mode Page 8"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب على قائد القطار إصدار إذاعة عامة لإعلام الركاب بالمحطة الانتهائية الجديدة والوضع الحالي والالتزام بحدود السرعة والإشارات بدقة.",
        "text_en": "The driver must issue a passenger announcement to inform them of the new terminal and current status, and strictly adhere to speed limits and signals."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "التدوير (Provisional Service) هو عبارة عن تدوير القطار من نقطة إلى نقطة في حالة وجود غير طبيعي على السكة ويمكن أن يكون التدوير من خلال تحويلة أمامية أو خلفية للمحطة.",
        "text_en": "Provisional Service refers to turning the train from point to point during abnormal situations. This shunting can be via front or rear switches."
      },
      "P2": {
        "type": "point_of_attention",
        "text_ar": "خط مفرد مؤقت (Temporary Single Track) هو عبارة عن تدوير القطار من نقطة إلى نقطة في حالة وجود عارض طبيعي على السكة ويتم بين محطتين على نفس السكة.",
        "text_en": "Temporary Single Track (TST) is operating trains on a single track between two stations due to track obstructions."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يطلب التحكم المركزي تطبيق عملية التدوير أو القيادة على خط مفرد مؤقت TST",
        "text_en": "Central Control requests provisional service or temporary single track (TST) operation.",
        "next": "action_get_instructions"
      },
      "action_get_instructions": {
        "type": "action",
        "text_ar": "اسأل عن المحطة الانتهائية وطريق المسير واتبع تعليمات التحكم المركزي مع استخدام نظام LMD إذا تم التوجيه",
        "text_en": "Ask about the terminal station and path, follow CC instructions, and use LMD mode if directed.",
        "linked_metadata": ["S1"],
        "next": "action_announce_provisional"
      },
      "action_announce_provisional": {
        "type": "action",
        "text_ar": "قم بإصدار إذاعة عامة للركاب لإبلاغهم بالوضع الحالي والمحطة الانتهائية الجديدة وتكرارها في كل محطة قبل غلق الأبواب",
        "text_en": "Issue a PA announcement to passengers regarding the new terminal and repeat at each station before door closure.",
        "next": "q_operation_type"
      },
      "q_operation_type": {
        "type": "question",
        "text_ar": "ما هو نوع الإجراء المطلوب تطبيقه؟",
        "text_en": "What is the type of procedure to be applied?",
        "yes": "action_front_shunting", // Option Front Shunting
        "no": "q_is_rear_shunting"
      },
      "q_is_rear_shunting": {
        "type": "question",
        "text_ar": "هل المطلوب هو 'التدوير من تحويلة خلفية'؟",
        "text_en": "Is the required procedure 'Rear Shunting'?",
        "yes": "action_rear_shunting",
        "no": "action_tst_single_track"
      },
      "action_front_shunting": {
        "type": "action",
        "text_ar": "التدوير من التحويلة الأمامية (DRI-DEG-105-1): أبلغ الركاب بنهاية الخدمة وإخلاء القطار، غير الكابينة وتأكد من الصالون، ثم اطلب تصريح حركة واتبع السيمافورات",
        "text_en": "Front Shunting (DRI-DEG-105-1): Notify passengers to evacuate, change cab, verify saloon, request movement authority, and follow signals.",
        "linked_metadata": ["P1"],
        "next": "END"
      },
      "action_rear_shunting": {
        "type": "action",
        "text_ar": "التدوير من التحويلة الخلفية (DRI-DEG-105-2): أبلغ الركاب بنهاية الخدمة، غير الكابينة وتأكد من خلو الصالون، ثم سر للنقطة التالية والتزم بالسيمافورات وافتح ناحية الرصيف",
        "text_en": "Rear Shunting (DRI-DEG-105-2): Notify passengers to evacuate, change cab, inspect saloon, drive to the next point following signals, and open platform side doors.",
        "linked_metadata": ["P1"],
        "next": "END"
      },
      "action_tst_single_track": {
        "type": "action",
        "text_ar": "خط مفرد مؤقت (DRI-DEG-105-3): أبلغ الركاب، غير الكابينة وتفقد خلو القطار، ثم سر بالاتجاه المفرد وافتح الأبواب ناحية الرصيف في المحطة المقابلة",
        "text_en": "Temporary Single Track (DRI-DEG-105-3): Inform passengers, change cab, inspect saloon, drive on the single track, and open platform side doors at the opposite station.",
        "linked_metadata": ["P2"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إكمال التدوير/الخط المفرد المؤقت بنجاح وبأمان",
        "text_en": "Provisional service / TST completed successfully and safely."
      }
    }
  },
  {
    sop_code: "DRI-DEG-106",
    category: "degraded",
    title_en: "Driving Opposite the Normal Direction",
    title_ar: "القيادة عكس الاتجاه",
    reference_documents: ["Capital Train Operator Rulebook Section 4.3", "SOPs DRI - Degraded Mode Page 13"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب أن تكون جميع حركات القطار عكس الاتجاه مصرحة ومؤكدة بالكامل من التحكم المركزي OCC، ويجب الالتزام بأنظمة السرعة المقررة واليقظة الكاملة.",
        "text_en": "All train movements opposite to normal direction must be fully authorized and confirmed by OCC. Adhere to specified speed limits and maintain full alertness."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "أكد مع التحكم المركزي أثناء تواجدك في المحطة أن التحاويل معدة على الاتجاه الجديد وتأكد أيضاً مع التحكم المركزي من نظام القيادة والسرعة المراد استخدامها.",
        "text_en": "Confirm with CC while at the station that switches are aligned for the new direction, and verify the driving system and speed limit to be used."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "قم بإصدار إذاعة عامة للركاب لإبلاغهم بالرصيف الجديد والمحطة الانتهائية وتنبيههم لاتجاه فتح الأبواب قبل الدخول للمحطة لتفادي أي ارتباك.",
        "text_en": "Issue a passenger announcement to inform them of the new platform, terminal station, and warn them of the door-opening side before station arrival to prevent confusion."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يصدر التحكم المركزي التعليمات لقائد القطار بالقيادة عكس اتجاه المسير",
        "text_en": "Central Control issues instructions to drive the train opposite to the normal direction.",
        "linked_metadata": ["S1"],
        "next": "action_confirm_route"
      },
      "action_confirm_route": {
        "type": "action",
        "text_ar": "احصل على تأكيد من التحكم المركزي حول اتجاه المسير والمحطات الابتدائية والانتهائية وتحقق من إعداد التحاويل والسرعة المقررة",
        "text_en": "Obtain confirmation from CC regarding direction, start/end stations, switch alignment, and authorized speed limit.",
        "linked_metadata": ["S2"],
        "next": "action_announce_passengers"
      },
      "action_announce_passengers": {
        "type": "action",
        "text_ar": "قم بإصدار إذاعة عامة للركاب لإبلاغهم بالرصيف الجديد والمحطة الانتهائية وباتجاه فتح الأبواب قبل دخول المحطات",
        "text_en": "Issue a PA announcement to passengers to inform them of the new platform, terminal, and door opening side before entering stations.",
        "linked_metadata": ["P1"],
        "next": "action_terminal_verify"
      },
      "action_terminal_verify": {
        "type": "action",
        "text_ar": "عند الوصول للمحطة الانتهائية، أكد مع التحكم المركزي حول وضع التحويلة والتعليمات الجديدة التي يجب اتباعها",
        "text_en": "Upon arriving at the terminal station, confirm switch status and new instructions with Central Control.",
        "next": "action_final_announcement"
      },
      "action_final_announcement": {
        "type": "action",
        "text_ar": "قم بإصدار إذاعة عامة أخيرة للركاب لتنبيههم باتجاه الرصيف الجديد واتجاه فتح الأبواب",
        "text_en": "Broadcast a final announcement to passengers notifying them of the new platform and door opening side.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إتمام القيادة عكس الاتجاه وتأمين حركة الركاب بنجاح",
        "text_en": "Driving opposite the normal direction completed and passenger safety secured."
      }
    }
  },
  {
    sop_code: "DRI-DEG-107",
    category: "degraded",
    title_en: "Management of Restrictive Signal in Non-CBTC Mode",
    title_ar: "التعامل مع سيمافور غير مصرح في وضع Non-CBTC",
    reference_documents: ["Capital Train Operator Rulebook Section 4.4", "SOPs DRI - Degraded Mode Page 15"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "القطار في وضع Non-CBTC والسيمافور القادم على السكة غير مصرح (أحمر). يجب إيقاف القطار فوراً قبل السيمافور وتجنب تجاوزه بدون تصريح خطي أو لفظي رسمي معتمد.",
        "text_en": "Train is in Non-CBTC mode and the upcoming signal is restrictive (red). Stop immediately before the signal and never pass without formal permission."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "عند تلقي تصريح التجاوز، يجب إعادة صياغة الإقرار وقراءته بدقة شاملاً رقم المهمة والقطار والسيمافور والسكة والتاريخ والوقت في جملة واحدة للتأكيد.",
        "text_en": "Upon receiving the bypass permit, repeat the permission statement exactly, including mission, train, signal, track, date, and time in a single continuous sentence for confirmation."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يقترب القطار في وضع Non-CBTC من سيمافور يعطي دلالة عدم عبور (مقيد / أحمر)",
        "text_en": "Train in Non-CBTC mode approaches a restrictive signal (red/no-passage).",
        "linked_metadata": ["S1"],
        "next": "action_stop_before_signal"
      },
      "action_stop_before_signal": {
        "type": "action",
        "text_ar": "قم بإيقاف القطار فوراً بالكامل قبل السيمافور، ثم أبلغ التحكم المركزي برقم السيمافور وحالته وموقعك",
        "text_en": "Immediately stop the train fully before the signal, and report the signal number, status, and your position to CC.",
        "next": "action_wait_directives"
      },
      "action_wait_directives": {
        "type": "action",
        "text_ar": "انتظر تعليمات التحكم المركزي وإذا لزم الأمر قم بعمل إذاعة طمأنة عامة على الركاب بالقطار",
        "text_en": "Wait for Central Control directives and issue a passenger reassurance announcement if necessary.",
        "next": "action_receive_bypass_permit"
      },
      "action_receive_bypass_permit": {
        "type": "action",
        "text_ar": "تلق تصريح التجاوز وقم بإعادة قراءته بدقة: 'مراقب الحركة يعطي تصريح تجاوز للسيمافور رقم XXX لقطار XXX على سكة XXX حتى سيمافور XXX بتاريخ ووقت...'",
        "text_en": "Receive bypass permit and repeat it back exactly: 'Traffic controller authorizes bypass of signal XXX for train XXX on track XXX up to signal XXX on date/time...'",
        "linked_metadata": ["P1"],
        "next": "q_is_at_platform_107"
      },
      "q_is_at_platform_107": {
        "type": "question",
        "text_ar": "هل يتواجد القطار حالياً بمحاذاة رصيف المحطة؟",
        "text_en": "Is the train currently aligned at a station platform?",
        "yes": "action_check_mirror_move",
        "no": "action_write_driver_form"
      },
      "action_check_mirror_move": {
        "type": "action",
        "text_ar": "تأكد من وضع الأبواب وسلامتها باستخدام مرآة الرصيف وشاشات CCTV قبل تحريك القطار وتجاوز السيمافور",
        "text_en": "Verify doors status and safety using the platform mirror and CCTV before moving the train to bypass the signal.",
        "next": "action_write_driver_form"
      },
      "action_write_driver_form": {
        "type": "action",
        "text_ar": "عند الوصول للمحطة الانتهائية، قم بملء وكتابة نموذج السائق (The Driver Form) لتسجيل تفاصيل واقعة التجاوز",
        "text_en": "Upon arrival at the terminal station, complete the Driver Form to log the bypass incident details.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تجاوز السيمافور المقيد بنجاح وبطريقة قانونية آمنة وفقاً للبروتوكول",
        "text_en": "Restrictive signal bypassed successfully and safely in accordance with protocol."
      }
    }
  },
  {
    sop_code: "DRI-DEG-108",
    category: "degraded",
    title_en: "Signal Passed at Danger (SPAD)",
    title_ar: "تجاوز سيمافور غير مصرح",
    reference_documents: ["Capital Train Operator Rulebook Section 4.5", "SOPs DRI - Degraded Mode Page 17"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "تجاوز السيمافور المقيد بدون تصريح مسبق يمثل خطورة بالغة. يجب تطبيق رباط الطوارئ فوراً لإيقاف القطار، وإجراء مكالمة طوارئ عاجلة لإبلاغ مركز التحكم.",
        "text_en": "Bypassing a restrictive signal without authorization is extremely dangerous. Apply emergency brakes immediately to stop the train and make an urgent emergency call to CC."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "يحظر استئناف الخدمة بنفسك إلا بعد صدور قرار واضح من التحكم المركزي أو استبدالك بقائد قطار آخر (قائد بديل) لضمان السلامة الفنية والذهنية.",
        "text_en": "Resuming service by yourself is prohibited until a clear decision is issued by CC or you are replaced by a relief driver to ensure safety."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "يجب تسجيل رقم السيمافور المتجاوز ودلالته الدقيقة والمسافة التقريبية بعد التجاوز، والاحتفاظ ببيانات السرعة والوقت المسجلة في الـ TCMS.",
        "text_en": "The bypassed signal number, its exact indication, and the approximate overrun distance must be noted, keeping speed and time records from TCMS."
      },
      "P2": {
        "type": "point_of_attention",
        "text_ar": "من الممكن أن يرسل التحكم المركزي مشرف نقل (Transport Supervisor) أو قائد بديل لتسلم القيادة واستكمال الرحلة للمحطة الانتهائية.",
        "text_en": "Central Control may dispatch a Transport Supervisor or relief driver to take over driving and complete the trip to the terminal."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يتجاوز قائد القطار سيمافور مقيد (أحمر) بدون تصريح مسبق من التحكم المركزي",
        "text_en": "Train driver bypasses a restrictive signal (red) without prior Central Control authorization.",
        "linked_metadata": ["S1"],
        "next": "action_emergency_braking"
      },
      "action_emergency_braking": {
        "type": "action",
        "text_ar": "طبق رباط الطوارئ فوراً لإيقاف القطار بالكامل، واجر مكالمة طوارئ عاجلة لإبلاغ التحكم المركزي بالموقف والسيمافور المتجاوز",
        "text_en": "Apply emergency brakes immediately to fully stop the train, and make an urgent emergency call to CC to report the SPAD.",
        "linked_metadata": ["P1"],
        "next": "action_verify_passengers"
      },
      "action_verify_passengers": {
        "type": "action",
        "text_ar": "راقب الركاب عبر CCTV وأجهزة الاتصال الداخلي لتهدئة الأوضاع، بانتظار تعليمات وقرار مركز التحكم",
        "text_en": "Monitor passengers via CCTV and interphone to maintain calm, awaiting Central Control instructions.",
        "next": "q_is_relief_ready"
      },
      "q_is_relief_ready": {
        "type": "question",
        "text_ar": "هل قائد القطار البديل (الاحتياطي/المشرف) متواجد وجاهز لتسلم الكابينة؟",
        "text_en": "Is the relief driver (backup/supervisor) present and ready to take over?",
        "yes": "action_handover_relief",
        "no": "action_continue_under_orders"
      },
      "action_handover_relief": {
        "type": "action",
        "text_ar": "اتبع تعليمات التحكم المركزي لتسليم الكابينة والقطار بالكامل للقائد البديل وغادر الكابينة فوراً للصالون",
        "text_en": "Follow CC instructions to hand over the cab and train to the relief driver, then exit the cab to the saloon.",
        "linked_metadata": ["P2"],
        "next": "action_report_handover"
      },
      "action_report_handover": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم بإتمام عملية التسليم، وتوجه لكتابة تقرير تفصيلي بالواقعة في محطة التوقف القادمة",
        "text_en": "Notify CC of completed handover, and proceed to write a detailed incident report at the next station.",
        "next": "END"
      },
      "action_continue_under_orders": {
        "type": "action",
        "text_ar": "استأنف المسير بنفسك بحذر شديد للمحطة الانتهائية بناء على تعليمات صريحة ومقيدة من التحكم المركزي وتوجيهات الصيانة",
        "text_en": "Resume driving with extreme caution to the terminal based on explicit restricted orders from CC and maintenance.",
        "linked_metadata": ["S2"],
        "next": "action_write_report_terminal"
      },
      "action_write_report_terminal": {
        "type": "action",
        "text_ar": "عند المحطة الانتهائية، بلّغ الصيانة لفحص القطار واكتب تقرير قائد القطار موضحاً كافة ملابسات التجاوز",
        "text_en": "At the terminal station, request maintenance inspection and write the driver report detailing the SPAD incident.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تمت معالجة واقعة التجاوز وتأمين مسار القطار والركاب وإعداد التقارير الفنية المعتمدة",
        "text_en": "SPAD incident managed, train and passengers secured, and technical reports logged."
      }
    }
  },
  {
    sop_code: "DRI-DEG-109",
    category: "degraded",
    title_en: "Train Not Correctly Docked (Over/Under Run)",
    title_ar: "وقوف غير صحيح للقطار",
    reference_documents: ["Capital Train Operator Rulebook Section 4.6", "SOPs DRI - Degraded Mode Page 19"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "في حال تجاوز القطار لرصيف المحطة بـ 4 أبواب أو أكثر، يحظر تماماً محاولة الرجوع للخلف دون تصريح رسمي، ويجب تأمين الأبواب التي خارج الرصيف عبر عزلها قبل فتح باقي الأبواب لسلامة الركاب.",
        "text_en": "If the train overruns the platform by 4 or more doors, reversing without authorization is strictly prohibited. Doors outside the platform must be isolated before opening others."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "يتكون الإجراء من حالتين: تجاوز المحطة (Overrun) أو الوقوف قبل علامة الوقوف (Underrun). يتطلب الوقوف قبل العلامة تحويلاً لـ LMD لتعديل موضع القطار ببطء.",
        "text_en": "The procedure covers two cases: Overrun (exceeding SSP) or Underrun (stopping before SSP). Underrun requires switching to LMD to adjust position slowly."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يتوقف القطار بالرصيف ولكن بشكل غير صحيح (لم يتطابق بدقة مع نقطة الوقوف SSP)",
        "text_en": "Train stops at platform but incorrectly (not aligned precisely with SSP stop point).",
        "linked_metadata": ["P1"],
        "next": "q_dock_type"
      },
      "q_dock_type": {
        "type": "question",
        "text_ar": "هل حالة عدم التطابق هي 'تجاوز المحطة' (Overrun)؟",
        "text_en": "Is the mismatch case an 'Overrun' (exceeding SSP)?",
        "yes": "action_overrun_proc",
        "no": "action_underrun_proc"
      },
      "action_underrun_proc": {
        "type": "action",
        "text_ar": "الوقوف قبل العلامة (DRI-DEG-109-2): حول لنظام القيادة اليدوية LMD، وتحرك للأمام ببطء حتى شاشة DMI تؤكد التطابق، وافتح أبواب الرصيف وأبلغ مركز التحكم ثم اكتب تقريراً",
        "text_en": "Underrun (DRI-DEG-109-2): Switch to LMD, inch forward slowly until DMI confirms alignment, open platform doors, notify CC, and write report.",
        "next": "END"
      },
      "action_overrun_proc": {
        "type": "action",
        "text_ar": "تجاوز المحطة (DRI-DEG-109-1): أبلغ مركز التحكم بموقع القطار الدقيق تمهيداً لاتخاذ قرار التجاوز والوقوف",
        "text_en": "Overrun (DRI-DEG-109-1): Notify Central Control of the exact train position to decide on the bypass or adjustment.",
        "next": "q_is_4_doors_over"
      },
      "q_is_4_doors_over": {
        "type": "question",
        "text_ar": "هل تجاوز القطار نقطة الوقوف SSP بمقدار 4 أبواب أو أكثر؟",
        "text_en": "Has the train overshot the SSP by 4 or more doors?",
        "yes": "action_isolate_outer_doors",
        "no": "action_reverse_adjust"
      },
      "action_reverse_adjust": {
        "type": "action",
        "text_ar": "أقل من 4 أبواب: أعلن للركاب بالتوجه للآخرين، ألغ تفعيل الكابينة وغادر للتوجه للكابينة الخلفية وتفعيلها والرجوع ببطء وتعديل الموضع بتصريح التحكم، ثم افتح الأبواب",
        "text_en": "Under 4 doors: Inform passengers, deactivate cab, walk to rear cab, activate it, reverse slowly to adjust position with CC permit, then open doors.",
        "next": "END"
      },
      "action_isolate_outer_doors": {
        "type": "action",
        "text_ar": "4 أبواب أو أكثر: أعلن للركاب بعدم الفتح للسلامة، غادر الكابينة لعزل الأبواب المتواجدة خارج الرصيف ميكانيكياً، عد للكابينة واطلب تصريح حركة وافتح الأبواب الآمنة على الرصيف",
        "text_en": "4 or more doors: Announce passengers to stay calm, leave cab to mechanically isolate doors outside platform, return and get CC permit, then open safe doors.",
        "linked_metadata": ["S1"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تمت معالجة وقوف القطار غير الصحيح وتأمين فتح الأبواب والركاب بنجاح",
        "text_en": "Incorrect docking managed, doors opened safely, and passengers secured."
      }
    }
  },
  {
    sop_code: "DRI-DEG-110",
    category: "degraded",
    title_en: "Wrong Side Door Opening",
    title_ar: "فتح الباب الجانبي في الاتجاه الخاطئ",
    reference_documents: ["Capital Train Operator Rulebook Section 4.7", "SOPs DRI - Degraded Mode Page 23"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب على قائد القطار فوراً إغلاق الأبواب لتفادي سقوط الركاب على السكة غير المحمية، والتحقق البصري من النافذة للتأكد من خلو المسار والسكة المجاورة من أي ركاب ساقطين.",
        "text_en": "The driver must immediately close the doors to prevent passengers falling onto the unprotected track, and visually check through the window to ensure no passengers have fallen."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "قم بإجراء مكالمة طوارئ عاجلة مع التحكم المركزي OCC واترك المكالمة مفتوحة ومستمرة، واطلب فوراً فصل التغذية الكهربائية للسكة المجاورة لضمان السلامة التامة.",
        "text_en": "Make an urgent emergency call to OCC and keep it open. Immediately request traction power isolation for the adjacent track to ensure total safety."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يقوم قائد القطار بالضغط بالخطأ على أزرار فتح الأبواب في الاتجاه المعاكس للرصيف (الاتجاه الخاطئ)",
        "text_en": "Driver mistakenly presses the door open buttons on the non-platform side (wrong side).",
        "next": "action_close_doors_instantly"
      },
      "action_close_doors_instantly": {
        "type": "action",
        "text_ar": "اضغط فوراً على أزرار غلق الأبواب لمنع خروج الركاب وإغلاق كافة الفتحات بالكامل وبأقصى سرعة",
        "text_en": "Immediately press the door close buttons to prevent passenger exit and seal all openings as fast as possible.",
        "linked_metadata": ["S1"],
        "next": "action_emergency_call_occ"
      },
      "action_emergency_call_occ": {
        "type": "action",
        "text_ar": "أجر مكالمة طوارئ عاجلة مع OCC لإعلامهم بالموقف، واطلب منهم فصل طاقة السكة المجاورة فوراً واترك المكالمة مستمرة",
        "text_en": "Initiate an urgent emergency call with OCC, request immediate power isolation for the adjacent track, and keep the call active.",
        "linked_metadata": ["P1"],
        "next": "action_inspect_track_window"
      },
      "action_inspect_track_window": {
        "type": "action",
        "text_ar": "تحقق بدقة عبر نوافذ الكابينة والمرايا الجانبية للتأكد من عدم سقوط أي شخص على القضبان المجاورة أو حدوث أي إصابات",
        "text_en": "Inspect carefully through cab windows and side mirrors to verify no passenger has fallen onto the adjacent tracks.",
        "next": "action_open_platform_side"
      },
      "action_open_platform_side": {
        "type": "action",
        "text_ar": "افتح الأبواب بالجانب الصحيح (ناحية رصيف المحطة) فوراً لتسهيل حركة الركاب الطبيعية وتهدئة الموقف",
        "text_en": "Open doors on the correct side (platform side) immediately to facilitate passenger movement and calm the situation.",
        "next": "action_report_terminal_log"
      },
      "action_report_terminal_log": {
        "type": "action",
        "text_ar": "اتبع تعليمات التحكم المركزي واستمر للمحطة الانتهائية لكتابة تقرير قائد القطار المفصل بالواقعة",
        "text_en": "Follow Central Control instructions, proceed to the terminal, and write a detailed driver report of the incident.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم احتواء واقعة فتح الأبواب بالاتجاه الخاطئ وتأمين السكة والركاب وإعداد التقارير الفنية اللازمة",
        "text_en": "Wrong-side door opening incident contained, tracks secured, and technical reports logged."
      }
    }
  },
  {
    sop_code: "DRI-DEG-111",
    category: "degraded",
    title_en: "Train Evacuation in Station",
    title_ar: "إخلاء القطار في المحطات",
    reference_documents: ["Capital Train Operator Rulebook Section 4.8", "SOPs DRI - Degraded Mode Page 25"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب التحقق التام من إخلاء جميع صالونات عربات القطار بالكامل وخلوها من الركاب عبر كاميرات CCTV والفحص البصري الدقيق قبل غلق الأبواب ومغادرة القطار.",
        "text_en": "Verify complete evacuation of all train saloons and ensure no passengers remain via CCTV and detailed visual sweep before closing doors and leaving."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "احصل على تصريح الإخلاء الرسمي من التحكم المركزي OCC وأعد التعليمات بدقة للتأكيد، محدداً رقم الخدمة، وموقع القطار واتجاهه وسبب الإخلاء الفني.",
        "text_en": "Obtain formal evacuation permission from OCC and repeat instructions precisely, specifying service number, train location, direction, and technical reason."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يتطلب الموقف إخلاء القطار بالكامل وهو متوقف بمحاذاة رصيف المحطة لسبب فني أو عارض طارئ",
        "text_en": "Situation requires full train evacuation while stopped at a station platform due to a technical defect or emergency.",
        "next": "action_get_evac_permit"
      },
      "action_get_evac_permit": {
        "type": "action",
        "text_ar": "اتصل بـ OCC للحصول على تصريح الإخلاء الرسمي وأعد قراءة تفاصيل التصريح بدقة لتأكيده بالكامل",
        "text_en": "Contact OCC to obtain formal evacuation clearance and repeat back the permit details to confirm.",
        "linked_metadata": ["P1"],
        "next": "action_evac_announce"
      },
      "action_evac_announce": {
        "type": "action",
        "text_ar": "شغل الإذاعة الداخلية لإبلاغ الركاب بالتزام الهدوء والبدء بالإخلاء الفوري ومغادرة القطار، والتوجيه بعدم صعود ركاب جدد",
        "text_en": "Activate the PA system to instruct passengers to stay calm, evacuate immediately, and prevent new passengers from boarding.",
        "next": "action_open_platform_doors_evac"
      },
      "action_open_platform_doors_evac": {
        "type": "action",
        "text_ar": "افتح جميع الأبواب الجانبية للقطار ناحية الرصيف بالكامل، وغادر الكابينة للإشراف ومساعدة موظفي المحطة في عملية الإخلاء بأمان",
        "text_en": "Open all platform-side train doors fully, and exit the cab to supervise and assist station staff in safe evacuation.",
        "next": "action_verify_empty_evac"
      },
      "action_verify_empty_evac": {
        "type": "action",
        "text_ar": "توجه للكابينة الخلفية وتفقد صالونات الركاب بصرياً وعبر الـ CCTV للتأكد من خلو القطار تماماً من آخر راكب",
        "text_en": "Walk to the rear cab, inspect all saloons visually and via CCTV to ensure the train is completely clear of passengers.",
        "linked_metadata": ["S1"],
        "next": "action_close_and_secure_evac"
      },
      "action_close_and_secure_evac": {
        "type": "action",
        "text_ar": "قم بغلق الأبواب بالكامل، وعد للكابينة الأمامية وأبلغ مركز التحكم OCC بانتهاء الإخلاء وجاهزية القطار للتحرك فارغاً أو التخزين",
        "text_en": "Close all doors, return to the front cab, and notify OCC of completed evacuation and readiness to shunt or stable.",
        "next": "action_write_evac_report"
      },
      "action_write_evac_report": {
        "type": "action",
        "text_ar": "قم بملء استمارة تقرير قائد القطار في المحطة لتسجيل تفاصيل عملية الإخلاء وتوقيتها وأسبابها",
        "text_en": "Complete the train driver report form at the station to log evacuation details, timing, and causes.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إخلاء القطار بالكامل وتأمين الرصيف وعربات القطار بنجاح وبأمان",
        "text_en": "Train fully evacuated, platform and cars secured successfully and safely."
      }
    }
  },
  {
    sop_code: "DRI-DEG-112",
    category: "degraded",
    title_en: "Sick or Injured Customers",
    title_ar: "ركاب مرضى أو مصابون",
    reference_documents: ["Capital Train Operator Rulebook Section 4.9", "SOPs DRI - Degraded Mode Page 27"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب على قائد القطار التنسيق مع ناظر المحطة (Station Master) لتقديم الإسعافات الأولية ونقل الراكب بأمان خارج القطار إلى الرصيف أو نقله بسيارة إسعاف.",
        "text_en": "Coordinate with the Station Master to provide first aid and safely move the passenger out of the train to the platform or ambulance."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "يجب على قائد القطار تقييم حالة الراكب من خلال شاشات CCTV لصالون الركاب وإبلاغ مركز التحكم OCC فوراً مع طلب الدعم الطبي.",
        "text_en": "The driver must assess the passenger's condition via saloon CCTV screens and report immediately to OCC, requesting medical assistance."
      },
      "P2": {
        "type": "point_of_attention",
        "text_ar": "إذا كان القطار بين محطتين، استمر بالقيادة للمحطة التالية وأوقف القطار هناك لتسهيل وصول المساعدات الطبية الطارئة.",
        "text_en": "If the train is between stations, continue driving to the next station and stop there to facilitate emergency medical access."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يتلقى قائد القطار بلاغاً عبر إنتركوم الركاب أو يلاحظ وجود راكب مريض أو مصاب بداخل عربات القطار",
        "text_en": "Driver receives passenger intercom alert or notices a sick/injured passenger inside the train cars.",
        "linked_metadata": ["P1"],
        "next": "q_is_at_station_112"
      },
      "q_is_at_station_112": {
        "type": "question",
        "text_ar": "هل يتواجد القطار حالياً بداخل محطة (محاذاة الرصيف)؟",
        "text_en": "Is the train currently inside a station (aligned at platform)?",
        "yes": "action_station_assist",
        "no": "action_proceed_next_station"
      },
      "action_proceed_next_station": {
        "type": "action",
        "text_ar": "استمر بالقيادة للمحطة التالية (يحظر الوقوف بالمسار المفتوح إلا لضرورة قصوى)، وأبلغ OCC للاستعداد بالمحطة",
        "text_en": "Continue driving to the next station (stopping in open track is prohibited), and notify OCC to prepare assistance at the platform.",
        "linked_metadata": ["P2"],
        "next": "action_station_assist"
      },
      "action_station_assist": {
        "type": "action",
        "text_ar": "ابق القطار متوقفاً واطلب من ناظر المحطة التوجه فوراً لتقديم المساعدات الإسعافية الطبية الأولية ونقل الراكب للرصيف",
        "text_en": "Keep the train stopped and request the Station Master to provide immediate first aid and assist the passenger to the platform.",
        "linked_metadata": ["S1"],
        "next": "action_report_occ_transfer"
      },
      "action_report_occ_transfer": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم OCC عندما يتم نقل الراكب بأمان خارج القطار، واستأذن لمتابعة المسير الطبيعي للرحلة",
        "text_en": "Notify OCC once the passenger is safely transferred out of the train, and request permission to resume normal service.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تقديم الرعاية اللازمة للمريض وتأمين سلامته ومتابعة تشغيل القطار بنجاح",
        "text_en": "Medical assistance provided to passenger, safety secured, and train operation resumed successfully."
      }
    }
  },
  {
    sop_code: "DRI-DEG-113",
    category: "degraded",
    title_en: "Abnormal Noise or Jerk",
    title_ar: "صوت أو هزة غير طبيعية",
    reference_documents: ["Capital Train Operator Rulebook Section 4.10", "SOPs DRI - Degraded Mode Page 29"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "عند سماع صوت غريب أو هزة شديدة، يجب إيقاف القطار فوراً لتجنب مخاطر الخروج عن القضبان وتنسيق الفحص الفني الميداني للسكة والعجلات مع مركز التحكم.",
        "text_en": "Upon hearing an abnormal sound or severe vibration, stop the train immediately to prevent derailment, and coordinate track/wheels technical inspection with CC."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "ينقسم الإجراء حسب موقع رصد الهزة: بين محطتين (يتطلب فحص جانبي السكة) أو داخل محطة (يتطلب فحص جانبي الرصيف).",
        "text_en": "The procedure is divided based on detection location: between stations (requires trackside inspection) or in station (requires platform side inspection)."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "تم ملاحظة أو سماع صوت غريب أو الشعور بهزة قوية غير طبيعية بالقطار",
        "text_en": "Abnormal sound is heard or strong unusual vibration/jerk is felt on the train.",
        "linked_metadata": ["P1"],
        "next": "q_location_type_113"
      },
      "q_location_type_113": {
        "type": "question",
        "text_ar": "هل تم رصد الصوت/الهزة 'بين محطتين' (على المسار المفتوح)؟",
        "text_en": "Was the noise/jerk detected 'between stations' (on open track)?",
        "yes": "action_stop_open_track",
        "no": "action_keep_stopped_station"
      },
      "action_stop_open_track": {
        "type": "action",
        "text_ar": "بين محطتين (DRI-DEG-113-1): طبق فرامل كاملة فوراً، تفقد شاشات TCMS وأبلغ مركز التحكم بالموقف واحصل على تصريح فحص السكة ميكانيكياً",
        "text_en": "Between stations (DRI-DEG-113-1): Apply full service brakes, check TCMS screens, notify OCC, and request track inspection clearance.",
        "linked_metadata": ["S1"],
        "next": "q_damage_found_track"
      },
      "q_damage_found_track": {
        "type": "question",
        "text_ar": "هل عثرت بالفحص العيني الميداني على أي أضرار بالقطار أو القضبان أو الشبكة الهوائية؟",
        "text_en": "Did you find any damage to the train, tracks, or catenary during visual inspection?",
        "yes": "action_report_damage_track",
        "no": "action_resume_restricted_track"
      },
      "action_report_damage_track": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم فوراً بالتلفيات المرصودة، واتبع تعليمات الصيانة للإنقاذ أو المساعدة",
        "text_en": "Report detected damage immediately to CC, and follow maintenance instructions for rescue/assistance.",
        "next": "END"
      },
      "action_resume_restricted_track": {
        "type": "action",
        "text_ar": "أبلغ التحكم بسلامة الفحص، واستأنف القيادة بسرعة مقيدة مصرح بها ومراقبة حذرة للمحطة القادمة",
        "text_en": "Report clear inspection to CC, and resume driving at authorized restricted speed with close monitoring to the next station.",
        "next": "END"
      },
      "action_keep_stopped_station": {
        "type": "action",
        "text_ar": "في المحطة (DRI-DEG-113-2): ابق متوقفاً بالرصيف، تفقد شاشة TCMS وأبلغ OCC واطلب تصريح فحص جانبي القطار من الرصيف",
        "text_en": "At station (DRI-DEG-113-2): Remain stopped, check TCMS, report to OCC, and request clearance to visually inspect train from platform.",
        "next": "q_damage_found_station"
      },
      "q_damage_found_station": {
        "type": "question",
        "text_ar": "هل عثرت على أية أضرار بالقطار أو بمعدات الرصيف أو القضبان بمحاذاة الرصيف؟",
        "text_en": "Did you find any damage to the train, platform equipment, or tracks at the station?",
        "yes": "action_report_damage_track",
        "no": "action_resume_restricted_track"
      },
      "END": {
        "type": "end",
        "text_ar": "تم إنهاء إجراءات فحص الهزة/الصوت وتأمين حركة القطار بنجاح وبأمان",
        "text_en": "Noise/jerk inspection completed, train movement secured successfully and safely."
      }
    }
  },
  {
    sop_code: "DRI-DEG-114",
    category: "degraded",
    title_en: "Obstruction on the Track (No Collision)",
    title_ar: "عائق على السكة (لا يوجد تصادم)",
    reference_documents: ["Capital Train Operator Rulebook Section 4.11", "SOPs DRI - Degraded Mode Page 33"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "عند ملاحظة عائق على القضبان، يجب إيقاف القطار فوراً بالكامل قبل العائق بمسافة آمنة لتجنب الاصطدام، وإطلاق إذاعة طمأنة للركاب وإخطار مركز التحكم.",
        "text_en": "Upon noticing a track obstruction, stop the train fully at a safe distance to prevent collision, issue passenger announcement, and notify CC."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "إذا كان العائق صغيراً ويمكن لقائد القطار إزالته بأمان، اطلب تصريح مغادرة الكابينة (SOP 007) لإزالته، وإلا انتظر دعم موظفي المحطة أو فريق الصيانة.",
        "text_en": "If the obstruction is small and can be safely cleared by the driver, request cab exit permit (SOP 007) to remove it; otherwise await station/maintenance support."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يلاحظ قائد القطار وجود عائق مادي أو جسم غريب على القضبان بالمسار المفتوح",
        "text_en": "Driver notices a physical obstruction or foreign object on the tracks in open path.",
        "next": "action_stop_before_obstruction"
      },
      "action_stop_before_obstruction": {
        "type": "action",
        "text_ar": "أوقف القطار فوراً بالكامل قبل العائق بمسافة آمنة، وقم بإجراء إذاعة عامة للركاب لإعلامهم بالموقف وطمأنتهم",
        "text_en": "Stop the train fully at a safe distance before the obstruction, and broadcast a reassuring PA to passengers.",
        "linked_metadata": ["S1"],
        "next": "q_can_driver_clear"
      },
      "q_can_driver_clear": {
        "type": "question",
        "text_ar": "هل يمكن لقائد القطار التدخل لإزالة هذا العائق بأمان بنفسه؟",
        "text_en": "Can the driver safely remove this obstruction by themselves?",
        "yes": "action_clear_it_self",
        "no": "action_wait_station_support"
      },
      "action_clear_it_self": {
        "type": "action",
        "text_ar": "اطلب تصريح مغادرة الكابينة من OCC، تفقد غلق الأجهزة وغادر لإزالة العائق، ثم عد وأبلغ OCC بالسلامة ومتابعة الحركة",
        "text_en": "Request cab exit clearance from OCC, secure console, remove obstruction, return, notify OCC, and resume movement.",
        "linked_metadata": ["P1"],
        "next": "END"
      },
      "action_wait_station_support": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم OCC بطلب دعم فني أو موظفي المحطة، واستمر في إخطار الركاب والتنسيق حتى يتم إزالة العائق بفرق الدعم",
        "text_en": "Request maintenance/station staff support from OCC, update passengers regularly, and await obstruction clearance by teams.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تأمين السكة وإزالة العائق بالكامل ومتابعة الخدمة بنجاح وبأمان",
        "text_en": "Track cleared, obstruction removed, and service resumed successfully and safely."
      }
    }
  },
  {
    sop_code: "DRI-DEG-115",
    category: "degraded",
    title_en: "Strong Wind Management",
    title_ar: "رياح قوية",
    reference_documents: ["Capital Train Operator Rulebook Section 4.12", "SOPs DRI - Degraded Mode Page 35"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "في حالات الرياح القوية أو العواصف، يجب التحويل الفوري لنظام القيادة اليدوية LMD لتطبيق السرعات المحددة بحذر واليقظة لأي عوائق متساقطة على القضبان.",
        "text_en": "In case of strong winds or storms, switch immediately to manual driving (LMD), apply speed restrictions carefully, and watch for falling obstacles on tracks."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "إذا تسببت العاصفة والرياح في تدهور مدى الرؤية وصعوبة رؤية السكة بوضوح، يجب التحول فوراً لتطبيق سيناريو ضعف الرؤية (DRI-DEG-117).",
        "text_en": "If strong winds cause severe visibility drop making track monitoring difficult, switch immediately to the Poor Visibility SOP (DRI-DEG-117)."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يرصد قائد القطار هبوب رياح شديدة، أو يتلقى تحذيراً رسمياً من التحكم المركزي بوجود رياح عاصفة",
        "text_en": "Driver detects severe strong winds, or receives formal storm/wind alerts from Central Control.",
        "next": "action_switch_lmd_wind"
      },
      "action_switch_lmd_wind": {
        "type": "action",
        "text_ar": "قم بالتحويل فوراً لنظام القيادة اليدوية LMD للتحكم الكامل بالسرعة وفق ظروف الرياح والالتزام بتوجيهات OCC",
        "text_en": "Switch immediately to LMD mode for full speed control based on wind conditions and OCC instructions.",
        "linked_metadata": ["S1"],
        "next": "q_is_visibility_good_wind"
      },
      "q_is_visibility_good_wind": {
        "type": "question",
        "text_ar": "هل مدى الرؤية واضح أمامك لرصد السكة ومؤشرات الإشارات بانتظام؟",
        "text_en": "Is visibility sufficient to monitor tracks and signal indicators clearly?",
        "yes": "action_drive_carefully_wind",
        "no": "action_trigger_poor_visibility"
      },
      "action_trigger_poor_visibility": {
        "type": "action",
        "text_ar": "الرؤية متدهورة: انتقل فوراً لتطبيق بروتوكول وإجراءات عارض ضعف الرؤية (SOP DRI-DEG-117) لحماية القطار",
        "text_en": "Poor visibility: Switch immediately to the Poor Visibility SOP (DRI-DEG-117) to secure the train.",
        "linked_metadata": ["P1"],
        "next": "END"
      },
      "action_drive_carefully_wind": {
        "type": "action",
        "text_ar": "قد بحذر منتبهاً للقضبان، وأصدر إذاعة طمأنة للركاب وإرشادهم بتوخي الحذر عند نزولهم بالمحطات، واتبع تعليمات OCC",
        "text_en": "Drive with care, broadcast passenger reassurance and exit safety guidance, and follow OCC speed instructions.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تمت معالجة عارض الرياح القوية وتوجيه القطار للمحطة بأمان",
        "text_en": "Strong wind incident managed and train navigated safely to the station."
      }
    }
  },
  {
    sop_code: "DRI-DEG-116",
    category: "degraded",
    title_en: "Flooding on the Mainline",
    title_ar: "الفيضان على الخط الرئيسي",
    reference_documents: ["Capital Train Operator Rulebook Section 4.13", "SOPs DRI - Degraded Mode Page 39"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "إذا بلغ منسوب مياه الفيضان أو السيول مستوى رأس القضيب الحديدي (Rail Head Level)، يمنع تماماً عبور القطار ويجب إيقافه فوراً بالكامل وإبلاغ مركز التحكم.",
        "text_en": "If flood water reaches the rail head level, passing is strictly prohibited. Stop the train fully and immediately, and notify CC."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "عند عبور مناطق بها مياه منخفضة (أقل من رأس القضيب)، قم بالتحويل لـ LMD والمسير بسرعة بطيئة ومقيدة جداً وإخطار OCC بالوضع بانتظام.",
        "text_en": "When crossing low-water areas (below rail head), switch to LMD, drive at a very slow and restricted speed, and report regularly to CC."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يلاحظ قائد القطار تجمع مياه كثيفة أو فيضان على القضبان بالخط الرئيسي",
        "text_en": "Driver spots heavy water accumulation or flooding on the mainline tracks.",
        "next": "action_slow_down_lmd_flood"
      },
      "action_slow_down_lmd_flood": {
        "type": "action",
        "text_ar": "قم بالتحويل فوراً لنظام القيادة اليدوية LMD لتقليل السرعة، وراقب بحذر تقدم منسوب المياه على السكة",
        "text_en": "Immediately switch to LMD to reduce speed, and closely monitor water level on the tracks.",
        "linked_metadata": ["P1"],
        "next": "q_water_rail_head"
      },
      "q_water_rail_head": {
        "type": "question",
        "text_ar": "هل وصل منسوب المياه إلى مستوى رأس القضيب الحديدي (Rail Head)؟",
        "text_en": "Has the water level reached the rail head?",
        "yes": "action_stop_flood_hazard",
        "no": "action_cross_restricted_speed"
      },
      "action_stop_flood_hazard": {
        "type": "action",
        "text_ar": "أوقف القطار فوراً بالكامل لتفادي خروج عن القضبان، وأبلغ مركز التحكم بالخطر، واتبع تعليمات الإخلاء أو الإنقاذ",
        "text_en": "Stop the train fully and immediately to prevent derailment, report danger to CC, and await evacuation/rescue instructions.",
        "linked_metadata": ["S1"],
        "next": "END"
      },
      "action_cross_restricted_speed": {
        "type": "action",
        "text_ar": "قد بسرعة بطيئة ومقيدة جداً، مع إبلاغ OCC بانتظام بمدى ملاءمة الوضع أثناء عبور المنطقة المتضررة حتى الخروج منها",
        "text_en": "Drive at a very slow restricted speed, reporting regularly to OCC on track suitability until safely exiting the flooded zone.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تمت معالجة عارض تجمع المياه وتأمين عبور أو وقوف القطار بنجاح",
        "text_en": "Water accumulation managed and train crossing or stop secured successfully."
      }
    }
  },
  {
    sop_code: "DRI-DEG-117",
    category: "degraded",
    title_en: "Poor Visibility Management",
    title_ar: "ضعف الرؤية",
    reference_documents: ["Capital Train Operator Rulebook Section 4.14", "SOPs DRI - Degraded Mode Page 41"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "في ظروف الضباب الكثيف أو العواصف الرملية، يجب التحكم الصارم في سرعة القطار والقيادة بالسرعات المقيدة بناء على مدى الرؤية المتاح وتشغيل كشافات الإنارة الكبيرة.",
        "text_en": "In thick fog or sandstorms, strictly control train speed, drive within restricted limits based on available visibility, and turn on high-beam headlights."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "يجب على قائد القطار إطلاق سرينة التحذير الصوتية بانتظام وبخاصة قبل دخول المحطات لتنبيه أي عاملين أو ركاب على الرصيف.",
        "text_en": "The driver must sound the warning horn regularly, especially before entering stations, to alert any personnel or platform passengers."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "تتدهور حالة الطقس (ضباب/غبار) وتصبح الرؤية غير واضحة أمام قائد القطار، أو يبلغه OCC بوجود ضعف رؤية بالمسار",
        "text_en": "Weather degrades (fog/dust) making forward visibility poor, or OCC alerts driver of poor visibility on path.",
        "next": "action_activate_high_beams"
      },
      "action_activate_high_beams": {
        "type": "action",
        "text_ar": "أبلغ OCC فوراً بالوضع، وقم بتشغيل كشافات الإنارة الأمامية الكبيرة لزيادة مدى الرؤية والتحكم في السرعة",
        "text_en": "Immediately report visibility status to OCC, activate high-beam headlights to enhance visibility, and restrict speed.",
        "linked_metadata": ["S1"],
        "next": "action_use_warning_horn"
      },
      "action_use_warning_horn": {
        "type": "action",
        "text_ar": "أطلق سرينة التحذير بانتظام وقبل دخول المحطات، وقم بعمل إذاعة عامة لإعلام الركاب بظروف الرحلة والتزام الهدوء",
        "text_en": "Sound the warning horn regularly and before stations, and broadcast a PA to reassure passengers and explain conditions.",
        "linked_metadata": ["P1"],
        "next": "action_monitor_and_report_occ"
      },
      "action_monitor_and_report_occ": {
        "type": "action",
        "text_ar": "استمر بمسير حذر بالسرعات المحددة، وأبلغ مركز التحكم فوراً عن رصد أي وضع غير طبيعي أو عوائق على السكة",
        "text_en": "Continue careful travel within restricted speed, and report immediately to OCC if any anomaly or obstruction is spotted.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تجاوز منطقة ضعف الرؤية وتسيير القطار للمحطات بأمان تام",
        "text_en": "Poor visibility zone cleared and train navigated to stations with total safety."
      }
    }
  },
  {
    sop_code: "DRI-DEG-118",
    category: "degraded",
    title_en: "Train Reset on Mainline",
    title_ar: "إعادة تشغيل القطار على الخط الرئيسي",
    reference_documents: ["Capital Train Operator Rulebook Section 4.15", "SOPs DRI - Degraded Mode Page 45"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يحظر تماماً محاولة عمل إعادة تشغيل (Reset) للكابينة أثناء حركة القطار. يجب وقوف القطار بالكامل وتطبيق رباط الانتظار والتحقق الفني عبر شاشة TCMS.",
        "text_en": "It is strictly forbidden to attempt a cab reset while the train is moving. The train must be completely stopped with holding brakes applied, and verified via TCMS."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "عملية إعادة التشغيل تتطلب الحصول على تصريح مسبق ومحدد من التحكم المركزي OCC وإصدار إذاعة عامة للركاب تفادياً للفزع نتيجة انقطاع التكييف والإنارة المؤقت.",
        "text_en": "The reset process requires prior explicit permit from OCC and a passenger PA to prevent panic due to temporary HVAC and light cutoff."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يواجه القطار عطلاً برمجياً أو فنياً مستعصياً بالأنظمة، ويتطلب حل العارض عمل إعادة تشغيل كاملة للكابينة بالخط الرئيسي",
        "text_en": "Train experiences persistent software or system faults, requiring a complete cab reset on the mainline to clear the defect.",
        "next": "action_stop_and_holding_brake"
      },
      "action_stop_and_holding_brake": {
        "type": "action",
        "text_ar": "أوقف القطار بالكامل، طبق رباط الانتظار وتأكد من ربطه في جميع عربات القطار عبر شاشة TCMS",
        "text_en": "Stop the train completely, apply the holding brake and verify its application across all cars via TCMS.",
        "linked_metadata": ["S1"],
        "next": "action_request_reset_permit"
      },
      "action_request_reset_permit": {
        "type": "action",
        "text_ar": "اتصل بـ OCC واطلب تصريح إعادة التشغيل موضحاً السبب، وأطلق إذاعة عامة لطمأنة الركاب والتزام الهدوء",
        "text_en": "Contact OCC to request reset clearance explaining the reason, and broadcast a passenger PA to maintain calm.",
        "linked_metadata": ["P1"],
        "next": "action_perform_reset_steps"
      },
      "action_perform_reset_steps": {
        "type": "action",
        "text_ar": "ضع يد التحكم بالحياد، ومفتاح الاتجاه على صفر، أدر المفتاح الرئيسي لوضع OFF وانتظر 10 ثوان قبل تشغيله مجدداً ON",
        "text_en": "Put controller to neutral, direction key to zero, turn master key to OFF and wait 10 seconds before turning to ON.",
        "next": "action_verify_tcms_screens"
      },
      "action_verify_tcms_screens": {
        "type": "action",
        "text_ar": "أعد تحديد اتجاه المسير للأمام، طبق أقصى وضع لفرامل الخدمة، تأكد من إقلاع الشاشات وخلت من العوارض وأبلغ OCC بالنتيجة",
        "text_en": "Set direction forward, apply full service brakes, verify screens booted successfully and cleared of faults, and report results to OCC.",
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم عمل إعادة تشغيل للكابينة بنجاح وزال العارض واستؤنفت الخدمة بأمان",
        "text_en": "Cab reset performed successfully, fault cleared, and service resumed safely."
      }
    }
  },

  // --- EMERGENCY SOPS (Bilingual Emergency SOPs matching normal formatting) ---
  ...EMERGENCY_SOPS,

  // --- TROUBLESHOOTING SOPS (Bilingual Troubleshooting matching normal formatting) ---
  {
    sop_code: "DRI-FLT-001",
    category: "troubleshooting",
    title_en: "Cabin or Saloon HVAC Failure",
    title_ar: "عطل في تكييف الكابينة أو صالون الركاب",
    reference_documents: ["Capital Train Operator Booklet Section 5.3", "TCMS Failure Actions Code"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "في حال ارتفاع درجة الحرارة فوق 32 درجة مئوية داخل الصالون، أبلغ مركز التحكم OCC فوراً للحصول على تصريح بإخلاء الركاب في المحطة التالية.",
        "text_en": "If saloon temperature rises above 32°C, notify CC immediately to get evacuation permit at the next station."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "تحقق من سلامة قواطع الدورة الرئيسية للتكييف في خزانة المعدات الكهربائية خلف الكابينة قبل طلب الدعم الفني.",
        "text_en": "Check HVAC main circuit breakers in the electrical cabinet behind the cab before requesting technical support."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "تلقي بلاغ عن توقف التكييف أو رصد انخفاض التبريد في الصالون أو الكابينة",
        "text_en": "Report of HVAC failure or cooling drop in saloon or cab.",
        "next": "q_is_cab_affected"
      },
      "q_is_cab_affected": {
        "type": "question",
        "text_ar": "هل العطل يمنع التكييف في كابينة القيادة النشطة للقطار؟",
        "text_en": "Does the failure affect the active driving cab's HVAC?",
        "yes": "action_cab_hvac_bypass",
        "no": "q_salon_temp_limit"
      },
      "action_cab_hvac_bypass": {
        "type": "action",
        "text_ar": "شغل مروحة التهوية البديلة الاحتياطية وافتح نافذة الكابينة الجانبية قليلاً لتمرير الهواء والحفاظ على تبريد مناسب",
        "text_en": "Turn on the auxiliary ventilation fan and slightly open the cab side window to maintain airflow.",
        "linked_metadata": ["S2"],
        "next": "q_salon_temp_limit"
      },
      "q_salon_temp_limit": {
        "type": "question",
        "text_ar": "هل درجة الحرارة داخل صالون الركاب لا تزال مقبولة (أقل من 32 درجة مئوية)؟",
        "text_en": "Is the temperature inside the passenger saloon still acceptable (below 32°C)?",
        "yes": "action_monitor_next_station",
        "no": "action_report_occ_evac_hvac"
      },
      "action_monitor_next_station": {
        "type": "action",
        "text_ar": "استمر في القيادة بحذر حتى المحطة التالية وراقب قراءة الحرارة على شاشات TCMS وأبلغ الصيانة للاستعداد بالمحطة النهائية",
        "text_en": "Continue driving with caution to the next station, monitor TCMS temp readings, and alert depot maintenance.",
        "next": "END"
      },
      "action_report_occ_evac_hvac": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم OCC فوراً بالموقف واطلب تبريد بديل وتصريح بإخلاء القطار في المحطة التالية لتجنب اختناق الركاب وتدافعهم",
        "text_en": "Immediately report to CC, request alternative ventilation and permit to evacuate at the next station to prevent passenger suffocation.",
        "linked_metadata": ["S1"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم التعامل مع عطل التكييف وتأمين صالون الركاب والكابينة بنجاح.",
        "text_en": "HVAC failure managed and saloon/cab secured successfully."
      }
    }
  },
  {
    sop_code: "DRI-FLT-002",
    category: "troubleshooting",
    title_en: "Pantograph Raising Failure",
    title_ar: "عطل تفعيل البانتوغراف",
    reference_documents: ["Capital Train Operator Booklet Section 4.2", "Panto Control Manual"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يمنع تماماً محاولة رفع البانتوغراف يدوياً أثناء تواجد القطار تحت سلك شبكة هوائية نشطة دون التحقق من عزل الطاقة وتأريضها.",
        "text_en": "It is strictly forbidden to attempt manual panto raise under live catenary wires without confirming isolation."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "تأكد من أن مفتاح الأمان للتحكم بالبانتوغراف في وضع التشغيل الطبيعي وأن ضغط هواء التحكم لا يقل عن 5.5 بار.",
        "text_en": "Ensure the panto safety key is in the normal position and control pressure is not below 5.5 bar."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "فشل تفعيل ورفع البانتوغراف بعد تشغيل المفتاح الرئيسي وتأكيد تفعيل الكابينة",
        "text_en": "Pantograph failed to raise after main switch activation and cab activation.",
        "next": "q_is_air_pressure_ok"
      },
      "q_is_air_pressure_ok": {
        "type": "question",
        "text_ar": "هل ضغط هواء التحكم الرئيسي للقطار كافٍ لرفع البانتوغراف (لا يقل عن 5.5 بار)؟",
        "text_en": "Is the main control air pressure sufficient (not below 5.5 bar)?",
        "yes": "q_panto_key_normal",
        "no": "action_run_aux_compressor"
      },
      "action_run_aux_compressor": {
        "type": "action",
        "text_ar": "قم بتشغيل الضاغط المساعد (Auxiliary Compressor) يدوياً لشحن خزان هواء البانتوغراف حتى يصل الضغط للحد المطلوب",
        "text_en": "Manually activate the auxiliary compressor to charge the panto air reservoir to the required pressure.",
        "next": "q_panto_key_normal"
      },
      "q_panto_key_normal": {
        "type": "question",
        "text_ar": "هل مفتاح الأمان للتحكم بالبانتوغراف (Panto Bypass Key) في الوضع الطبيعي المعتاد؟",
        "text_en": "Is the panto bypass key/switch in the normal default position?",
        "yes": "action_toggle_panto",
        "no": "action_enable_panto_bypass"
      },
      "action_enable_panto_bypass": {
        "type": "action",
        "text_ar": "قم بوضع مفتاح الأمان في وضع التجاوز (Bypass) بعد التنسيق التام وتلقي تعليمات واضحة من OCC",
        "text_en": "Put the safety key into Bypass position after coordinating and receiving instructions from CC.",
        "linked_metadata": ["S2"],
        "next": "action_toggle_panto"
      },
      "action_toggle_panto": {
        "type": "action",
        "text_ar": "قم بإعادة تدوير مفتاح تفعيل البانتوغراف مرتين لتنشيط صمامات الهواء الكهرومغناطيسية ورفع الذراع",
        "text_en": "Cycle the panto activation switch twice to trigger electromagnetic air valves and lift the pantograph.",
        "next": "q_is_panto_raised"
      },
      "q_is_panto_raised": {
        "type": "question",
        "text_ar": "هل ارتفع البانتوغراف وتأكدت من وصول التيار الكهربائي العالي (1500VDC) على شاشة TCMS؟",
        "text_en": "Did the panto raise and high voltage (1500VDC) register on the TCMS screen?",
        "yes": "END",
        "no": "action_panto_rescue"
      },
      "action_panto_rescue": {
        "type": "action",
        "text_ar": "أوقف جميع المحاولات فوراً، أبلغ OCC بوجود عطل ميكانيكي صلب، واطلب الدعم الفني الفوري أو قطار إغاثة للجر",
        "text_en": "Stop all attempts, notify CC of hard mechanical failure, and request immediate technical support or a rescue train.",
        "linked_metadata": ["S1"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تفعيل البانتوغراف بنجاح وتوصيل الطاقة للقطار وتشغيل كافة الأنظمة الحيوية.",
        "text_en": "Pantograph raised successfully and high voltage traction power restored."
      }
    }
  },
  {
    sop_code: "DRI-FLT-003",
    category: "troubleshooting",
    title_en: "Single Passenger Door Failure",
    title_ar: "عطل فردي في أبواب القطار",
    reference_documents: ["Capital Train Operator Booklet Section 6.1", "Passenger Door Mechanics Code"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يجب التأكد من قفل الباب المعطل ميكانيكياً ووضع ملصق 'خارج الخدمة' عليه قبل السماح للقطار بمغادرة المحطة.",
        "text_en": "Ensure the defective door is mechanically locked and has an 'Out of Service' sticker before departing."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "لا تتجاوز إشارة الأبواب المغلقة عبر مفتاح التجاوز (Door Bypass) إلا بتعليمات صريحة ومباشرة من مركز التحكم OCC وبسرعة لا تتعدى 25 كم/س.",
        "text_en": "Do not bypass the door closed loop unless specifically instructed by CC, and limit speed to 25 km/h."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "رصد عطل أو انحشار في باب فردي لصالون الركاب أثناء التواجد بالمحطة وظهور وميض أحمر على لوحة السائق",
        "text_en": "Defect or obstruction detected on a single passenger door while at station, with a flashing red light on cab panel.",
        "next": "q_obstr"
      },
      "q_obstr": {
        "type": "question",
        "text_ar": "هل يوجد عائق مادي أو جسم غريب واضح يمنع قفل الباب? (Obstruction)",
        "text_en": "Is there a physical obstruction or foreign body preventing the door from closing?",
        "yes": "action_remove_obstr",
        "no": "action_isolate_door"
      },
      "action_remove_obstr": {
        "type": "action",
        "text_ar": "قم بإزالة العائق يدوياً برفق ثم أعد محاولة غلق الأبواب وتأكد من زوال الوميض الأحمر",
        "text_en": "Manually and safely remove the obstruction, then cycle doors and verify the flashing red light is gone.",
        "next": "q_closed"
      },
      "action_isolate_door": {
        "type": "action",
        "text_ar": "توجه فوراً للباب المعطل، واستخدم مقبض العزل المحلي (Local Isolation Handle) لإخراج الباب من الخدمة وقفله ميكانيكياً",
        "text_en": "Go to the defective door and operate the local isolation handle to isolate and mechanically lock the door.",
        "next": "action_sticker"
      },
      "action_sticker": {
        "type": "action",
        "text_ar": "قم بوضع ملصق 'خارج الخدمة' (Out of Service) على جانبي الباب المعطل لإعلام الركاب ومنعهم من الاتكاء عليه",
        "text_en": "Apply 'Out of Service' sticker to both sides of the isolated door to notify passengers and prevent leaning.",
        "linked_metadata": ["S1"],
        "next": "q_closed"
      },
      "q_closed": {
        "type": "question",
        "text_ar": "هل حصلت على إشارة الأبواب المغلقة بالكامل (Loop Closed Indicator) على لوحة الكابينة؟",
        "text_en": "Is the door loop closed indicator fully illuminated on the cab control panel?",
        "yes": "END",
        "no": "action_door_bypass"
      },
      "action_door_bypass": {
        "type": "action",
        "text_ar": "أبلغ مركز التحكم OCC فوراً بمشكلة حلقة الإغلاق، واستأذن لتفعيل مفتاح تجاوز الأبواب (Door Bypass Switch) لتتمكن من التحرك بسرعة لا تتجاوز 25 كم/ساعة للمغادرة للورشة",
        "text_en": "Immediately inform CC, and ask for permission to activate the Door Bypass Switch to depart towards the depot at maximum 25 km/h.",
        "linked_metadata": ["S2"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم تأمين الباب المعطل وعزل التشغيل بنجاح ومغادرة المحطة بأمان.",
        "text_en": "Defective door secured and isolated successfully, station departed safely."
      }
    }
  }
];
