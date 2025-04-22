const getMessage = (key, language) => {
    const messages = {
        invalidLanguage: {
            en: "Invalid language",
            ar: "لغة غير صالحة"
        },
        invalidRequest: {
            en: "Invalid request structure",
            ar: "خطأ في الطلب"
        },
        userNotFound: {
            en: "User not found",
            ar: "المستخدم غير موجود"
        },
        
        registrationSuccess: {
            en: "Registration successful",
            ar: "تم التسجيل بنجاح"
        },
        emailAlreadyExists: {
            en: "Email already exists",
            ar: "البريد الإلكتروني موجود بالفعل"
        },
        
        // رسائل تسجيل الدخول
        loginSuccess: {
            en: "Login successfully",
            ar: "تم تسجيل الدخول بنجاح"
        },
        invalidPassword: {
            en: "Invalid password",
            ar: "كلمة المرور غير صحيحة"
        },

        // رسائل المواضيع
        maxTopics: {
            en: "You can select a maximum of 5 topics",
            ar: "انت تستطيع تحديد فقط 5 اصناف"
        },
        noValidTopics: {
            en: "No valid topics found",
            ar: "لا وجود لاي صنف"
        },
        topicsSelected: {
            en: "Topics selected successfully",
            ar: "تم تحديد الاصناف بنجاح"
        },

        // رسائل المنشورات
        postCreated: {
            en: "Post created successfully",
            ar: "تم إنشاء المنشور بنجاح"
        },
        postDeleted: {
            en: "Post deleted successfully",
            ar: "تم حذف المنشور بنجاح"
        },
        postNotFound: {
            en: "Post not found",
            ar: "المنشور غير موجود"
        },
        postSharedSuccessfully: {
            en : "Post Shared Successfully",
            ar: "تمت مشاركة المنشور بنجاح"
        },
        
        // رسائل التعليقات
        commentAdded: {
            en: "Comment added successfully",
            ar: "تم إضافة التعليق بنجاح"
        },
        commentDeleted: {
            en: "Comment deleted successfully",
            ar: "تم حذف التعليق بنجاح"
        },
        postLikedSuccessfully: {
            en: "Post liked successfully",
            ar: "تم الاعجاب بالمنشور"
        },
        // رسائل المتابعة
        userFollowed: {
            en: "You are now following this user",
            ar: "أنت الآن تتابع هذا المستخدم"
        },
        userUnfollowed: {
            en: "You have unfollowed this user",
            ar: "لقد ألغيت متابعة هذا المستخدم"
        },

        // رسائل الإشعارات
        notificationReceived: {
            en: "You have a new notification",
            ar: "لديك إشعار جديد"
        },
        verificationCodeSent :{
            en : "Verification Code Sent",
            ar: "تم ارسال رمز التحقق"
        },
        invalidVerificationCode : {
            en : "Invalid Verification Code",
            ar : "كود غير صالح"
        },
        passwordResetSuccess : {
            en: "Password Reset Success",
            ar : "تم استعادة كلمة السر بنجاح"
        },
        contentandtopicsarerequired:{
            en : "Content and topics are required.",
            ar: "نص المنشور و نوع المحتوى مطلوب"
        },
        hashtagMustStartWithHash: {
            ar: "يجب أن يبدأ الهاشتاج بعلامة #.",
            en: "Hashtag must start with #."
        }
        
    };
    return messages[key][language] || messages[key].en; 
};

module.exports = getMessage;