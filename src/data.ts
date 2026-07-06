import { SOP } from './types';

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

  // --- DEGRADED SOPS (2 SOPs from previous versions) ---
  {
    sop_code: "DRI-DEG-103",
    category: "degraded",
    title_en: "On Board Radio System Failure",
    title_ar: "عطل نظام الراديو على متن القطار",
    reference_documents: ["Capital Train Operator Rulebook", "RDMC LRT Incident Management Plan"],
    metadata: {
      "P1": {
        "type": "point_of_attention",
        "text_ar": "لا يعتبر عطل نظام الراديو حالة طارئة تمنع القطار من استئناف الخدمة، وبالتالي وفقاً لقرار التحكم المركزي، يمكن للقطار استكمال الرحلة أو خروجه من الخدمة وإرساله إلى الورشة.",
        "text_en": "On-board radio system failure is NOT considered an urgent emergency that prevents resuming service. According to Central Control's decision, the train may continue the trip or be withdrawn from service and dispatched to the depot."
      },
      "S1": {
        "type": "safety_point",
        "text_ar": "- لاستخدام هاتف الإشارة المتواجد على الرصيف أو هاتف الطوارئ الملحق بالإشارات، سيقوم قائد القطار بمغادرة الكابينة بعد اتخاذ جميع تدابير السلامة لمغادرة الكابينة.\n- إذا كان القطار بين محطتين، سيجد أقرب هاتف طوارئ ملحق بالإشارة.\n- إذا كان القطار متواجداً على الرصيف، فيمكن لقائد القطار استخدام الهاتف الموجود على الرصيف أسفل شاشة DTI.",
        "text_en": "- To use the platform signal telephone or the signal-mounted emergency phone, the train driver will exit the cab after taking all safety measures for leaving the cab.\n- If the train is between two stations, find the nearest signal-attached emergency phone.\n- If the train is at a platform, the driver can use the platform phone located beneath the DTI screen."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يكتشف قائد القطار مشكلة أو تم إبلاغه بوجود عطل في نظام الراديو الموجود على متن القطار",
        "text_en": "Train Driver detects a problem or is notified of an on-board radio system failure.",
        "linked_metadata": ["P1"],
        "next": "q1"
      },
      "q1": {
        "type": "question",
        "text_ar": "جهاز اللاسلكي يعمل؟",
        "text_en": "Is the wireless handset/radio working?",
        "yes": "action_wireless_ok",
        "no": "action_wireless_failed"
      },
      "action_wireless_failed": {
        "type": "action",
        "text_ar": "عند توقف القطار استخدم أقرب هاتف إشارات متاح لإبلاغ مركز التحكم بعطل الراديو",
        "text_en": "Once the train is safely stopped, use the nearest available signal phone to report the radio failure to the Control Center.",
        "linked_metadata": ["S1"],
        "next": "follow_cc_end"
      },
      "follow_cc_end": {
        "type": "action",
        "text_ar": "اتبع تعليمات التحكم المركزي",
        "text_en": "Follow Central Control (CC) instructions.",
        "next": "END"
      },
      "action_wireless_ok": {
        "type": "action",
        "text_ar": "قم بالاتصال بالتحكم المركزي باستخدام اللاسلكي لإبلاغه بالموقف.\nثم قم بإعادة ضبط الراديو من خلال زر التشغيل / الإيقاف ON/OFF.\nحاول الاتصال بالتحكم المركزي من خلال الراديو.",
        "text_en": "Contact Central Control via wireless handset to report the situation.\nThen reset the radio using the ON/OFF button.\nAttempt to communicate with Central Control via the main radio.",
        "next": "q2"
      },
      "q2": {
        "type": "question",
        "text_ar": "الراديو يعمل بعد إعادة الضبط؟",
        "text_en": "Is the radio working normally after the reset?",
        "yes": "follow_cc_end",
        "no": "action_reset_failed"
      },
      "action_reset_failed": {
        "type": "action",
        "text_ar": "قم بالاتصال بالتحكم المركزي باستخدام اللاسلكي لإبلاغه بالموقف.\nاستأنف الرحلة حتى المحطة الانتهائية ما لم يتم إبلاغك بخلاف ذلك من قبل التحكم المركزي.\nعند المحطة الانتهائية بلّغ التحكم المركزي بطلب تدخل الصيانة لإصلاح العطل.",
        "text_en": "Contact Central Control via wireless handset to report the situation.\nResume the trip to the terminal station unless instructed otherwise by Central Control.\nUpon arrival at the terminal, request maintenance intervention from CC to repair the defect.",
        "next": "follow_cc_end"
      },
      "END": {
        "type": "end",
        "text_ar": "النهاية: تم تنفيذ الإجراء بنجاح ومتابعة مركز التحكم",
        "text_en": "END: Procedure executed successfully. Central Control monitoring active."
      }
    }
  },
  {
    sop_code: "DRI-DEG-104",
    category: "degraded",
    title_en: "Platform Screen Door Mismatch",
    title_ar: "عدم تطابق أبواب رصيف المحطة مع أبواب القطار",
    reference_documents: ["LRT Station Operations Manual Section 4", "PSD Integration Manual"],
    metadata: {
      "P1": {
        "type": "point_of_attention",
        "text_ar": "يجب على قائد القطار تفقد رصيف المحطة من خلال المرآة أو شاشة CCTV للتأكد من عدم وجود ركاب محشورين بين القطار والرصيف.",
        "text_en": "The train driver must inspect the platform via the side mirrors or CCTV feed to ensure no passengers are caught between the train and PSD."
      },
      "S1": {
        "type": "safety_point",
        "text_ar": "يمنع تماماً محاولة تحريك القطار طالما أن أبواب الرصيف مفتوحة ولم يتم تجاوزها بقرار رسمي من مركز التحكم ومفتاح التجاوز مغلق.",
        "text_en": "It is strictly forbidden to attempt moving the train as long as platform screen doors are open, unless overridden by an official CC decision with the bypass switch locked."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "يتوقف القطار في المحطة ولكن لا تتطابق الأبواب أو لا تفتح أبواب الرصيف تلقائياً.",
        "text_en": "Train stops at station but doors do not align or platform screen doors (PSD) fail to open automatically.",
        "linked_metadata": ["P1"],
        "next": "q1"
      },
      "q1": {
        "type": "question",
        "text_ar": "هل مؤشر محاذاة القطار (Stop Board / Align Indicator) مضاء باللون الأخضر بالكابينة؟",
        "text_en": "Is the train alignment indicator (Stop Board / Align Indicator) illuminated green in the cab?",
        "yes": "action_manual_open",
        "no": "action_inch_train"
      },
      "action_inch_train": {
        "type": "action",
        "text_ar": "قم بتحريك القطار ببطء شديد للأمام أو الخلف (Inching) حتى يتطابق مؤشر الوقوف بدقة.",
        "text_en": "Move the train very slowly forward or backward (Inching) until the stop board indicator is precisely aligned.",
        "linked_metadata": ["S1"],
        "next": "q2"
      },
      "q2": {
        "type": "question",
        "text_ar": "هل الأبواب تفتح الآن تلقائياً بعد تصحيح الوقوف؟",
        "text_en": "Do the doors open automatically now after aligning?",
        "yes": "END",
        "no": "action_manual_open"
      },
      "action_manual_open": {
        "type": "action",
        "text_ar": "اضغط على زر الفتح اليدوي المزدوج لأبواب القطار وأبواب الرصيف معاً.",
        "text_en": "Press the dual manual open button for both train doors and platform screen doors simultaneously.",
        "next": "q3"
      },
      "q3": {
        "type": "question",
        "text_ar": "هل فتحت أبواب الرصيف بالكامل وتمكن الركاب من الخروج؟",
        "text_en": "Are the platform screen doors fully open allowing passenger egress?",
        "yes": "END",
        "no": "action_local_bypass"
      },
      "action_local_bypass": {
        "type": "action",
        "text_ar": "أبلغ ناظر المحطة لاستخدام مفتاح الفتح المحلي لكل باب رصيف يدوياً، واستأذن مركز التحكم للتجاوز عند المغادرة.",
        "text_en": "Notify the Station Master to use the local manual override key for each platform door, and request CC permission to bypass on departure.",
        "linked_metadata": ["S1"],
        "next": "END"
      },
      "END": {
        "type": "end",
        "text_ar": "تم حل المشكلة وتأمين الرصيف لمتابعة الخدمة",
        "text_en": "Mismatch resolved or bypassed. Platform secured to resume service."
      }
    }
  },

  // --- EMERGENCY SOPS (1 SOP from previous versions) ---
  {
    sop_code: "DRI-EME-201",
    category: "emergency",
    title_en: "Fire or Smoke on Board Train",
    title_ar: "حريق أو انبعاث دخان على متن القطار",
    reference_documents: ["LRT Disaster Management Code", "LRT Fire Life Safety Instructions"],
    metadata: {
      "S1": {
        "type": "safety_point",
        "text_ar": "يمنع تماماً إيقاف القطار داخل النفق إذا كان الحريق مشتعلاً في عربات القطار؛ بل يجب الاستمرار في القيادة حتى المحطة التالية لضمان التهوية وتسهيل عملية الإخلاء.",
        "text_en": "It is absolutely forbidden to stop the train inside a tunnel if a fire is active; you MUST continue driving to the next station to ensure ventilation and facilitate evacuation."
      },
      "S2": {
        "type": "safety_point",
        "text_ar": "في حالة التوقف الاضطراري بالمسار المفتوح، يجب تفعيل مروحة طرد الدخان بالاتجاه المعاكس لاتجاه الرياح لإبعاد الدخان عن الركاب أثناء الإخلاء.",
        "text_en": "In case of emergency stop on an open track, activate the smoke extraction fans in the direction opposite to wind flow to keep smoke away from passengers."
      },
      "P1": {
        "type": "point_of_attention",
        "text_ar": "قم بتهدئة الركاب عبر نظام الإذاعة الداخلية (PA) لمنع التدافع والهلع.",
        "text_en": "Reassure passengers via the Passenger Announcement (PA) system to prevent stampede and panic."
      }
    },
    flowchart: {
      "start": {
        "text_ar": "انطلاق إنذار الحريق التلقائي بالقطار أو إبلاغ قائد القطار من الركاب بوجود دخان أو نار.",
        "text_en": "Automatic fire alarm triggers in the cab, or passenger interphone reports smoke or active fire.",
        "linked_metadata": ["P1"],
        "next": "q1"
      },
      "q1": {
        "type": "question",
        "text_ar": "هل يتواجد القطار حالياً داخل نفق (Tunnel Section)؟",
        "text_en": "Is the train currently inside a tunnel section?",
        "yes": "action_drive_next_station",
        "no": "action_emergency_stop_track"
      },
      "action_drive_next_station": {
        "type": "action",
        "text_ar": "استمر بالقيادة فوراً إلى المحطة التالية. أبلغ مركز التحكم والخدمات الطارئة للتأهب في تلك المحطة.",
        "text_en": "Continue driving immediately to the next station. Notify CC and Emergency Services to stand by at that station.",
        "linked_metadata": ["S1"],
        "next": "action_station_evacuate"
      },
      "action_emergency_stop_track": {
        "type": "action",
        "text_ar": "قم بتطبيق الفرملة الكاملة حتى يتوقف القطار تماماً بالمنطقة المفتوحة. أبلغ مركز التحكم بالموقع الدقيق.",
        "text_en": "Apply full brakes until the train stops completely on the open track. Inform CC of the exact location.",
        "next": "action_track_evacuate"
      },
      "action_station_evacuate": {
        "type": "action",
        "text_ar": "عند الوصول للمحطة، افتح جميع الأبواب فوراً، واقطع التيار الكهربائي عن القطار، وابدأ بإخلاء المحطة والقطار بمساعدة الموظفين.",
        "text_en": "Upon arrival at the station, open all doors immediately, drop main traction power, and initiate passenger evacuation with station staff.",
        "next": "END"
      },
      "action_track_evacuate": {
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
  // --- TROUBLESHOOTING / FAULT SOPS (3 SOPs for Troubleshooting) ---
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
        "next": "q1"
      },
      "q1": {
        "type": "question",
        "text_ar": "هل العطل يمنع التكييف في كابينة القيادة النشطة للقطار؟",
        "text_en": "Does the failure affect the active driving cab's HVAC?",
        "yes": "action_cab_hvac",
        "no": "q_salon_temp"
      },
      "action_cab_hvac": {
        "type": "action",
        "text_ar": "شغل مروحة التهوية البديلة الاحتياطية وافتح نافذة الكابينة الجانبية قليلاً لتمرير الهواء والحفاظ على تبريد مناسب",
        "text_en": "Turn on the auxiliary ventilation fan and slightly open the cab side window to maintain airflow.",
        "next": "q_salon_temp"
      },
      "q_salon_temp": {
        "type": "question",
        "text_ar": "هل درجة الحرارة داخل صالون الركاب لا تزال مقبولة (أقل من 32 درجة مئوية)؟",
        "text_en": "Is the temperature inside the passenger saloon still acceptable (below 32°C)?",
        "yes": "action_monitor_next",
        "no": "action_report_occ_evac"
      },
      "action_monitor_next": {
        "type": "action",
        "text_ar": "استمر في القيادة بحذر حتى المحطة التالية وراقب قراءة الحرارة على شاشات TCMS وأبلغ الصيانة للاستعداد بالمحطة النهائية",
        "text_en": "Continue driving with caution to the next station, monitor TCMS temp readings, and alert depot maintenance.",
        "next": "END"
      },
      "action_report_occ_evac": {
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
    title_ar: "عطل تفعيل البانتوغراف (رفع الذراع)",
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
        "next": "q_air"
      },
      "q_air": {
        "type": "question",
        "text_ar": "هل ضغط هواء التحكم الرئيسي للقطار كافٍ لرفع البانتوغراف (لا يقل عن 5.5 بار)؟",
        "text_en": "Is the main control air pressure sufficient (not below 5.5 bar)?",
        "yes": "q_switch",
        "no": "action_aux_compressor"
      },
      "action_aux_compressor": {
        "type": "action",
        "text_ar": "قم بتشغيل الضاغط المساعد (Auxiliary Compressor) يدوياً لشحن خزان هواء البانتوغراف حتى يصل الضغط للحد المطلوب",
        "text_en": "Manually activate the auxiliary compressor to charge the panto air reservoir to the required pressure.",
        "next": "q_switch"
      },
      "q_switch": {
        "type": "question",
        "text_ar": "هل مفتاح الأمان للتحكم بالبانتوغراف (Panto Bypass Key) في الوضع الطبيعي المعتاد؟",
        "text_en": "Is the panto bypass key/switch in the normal default position?",
        "yes": "action_toggle",
        "no": "action_set_bypass"
      },
      "action_set_bypass": {
        "type": "action",
        "text_ar": "قم بوضع مفتاح الأمان في وضع التجاوز (Bypass) بعد التنسيق التام وتلقي تعليمات واضحة من OCC",
        "text_en": "Put the safety key into Bypass position after coordinating and receiving instructions from CC.",
        "linked_metadata": ["S2"],
        "next": "action_toggle"
      },
      "action_toggle": {
        "type": "action",
        "text_ar": "قم بإعادة تدوير مفتاح تفعيل البانتوغراف مرتين لتنشيط صمامات الهواء الكهرومغناطيسية ورفع الذراع",
        "text_en": "Cycle the panto activation switch twice to trigger electromagnetic air valves and lift the pantograph.",
        "next": "q_raised"
      },
      "q_raised": {
        "type": "question",
        "text_ar": "هل ارتفع البانتوغراف وتأكدت من وصول التيار الكهربائي العالي (1500VDC) على شاشة TCMS؟",
        "text_en": "Did the panto raise and high voltage (1500VDC) register on the TCMS screen?",
        "yes": "END",
        "no": "action_request_rescue"
      },
      "action_request_rescue": {
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
        "text_ar": "هل يوجد عائق مادي أو جسم غريب واضح يمنع قفل الباب؟",
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
