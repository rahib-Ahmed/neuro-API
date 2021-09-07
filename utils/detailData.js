const { body } = require('express-validator');  
exports.teacherProfile = async function (req) {
    const teach = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        dob: req.body.dob,
        countryCode: req.body.countryCode,
        phone: req.body.phone,
        teacherType: req.body.teacherType,
        teacherProfilePic: {
            imageProfile: req.body.imageProfile,
            imageProfileData: req.files.imageProfileData
        },
        languageSpeak: req.body.languageSpeak,
        languageTeaches: req.body.languageTeaches,
        videoURL: req.body.videoURL,
        selfIntro: req.body.selfIntro,
        region: {
            fromCountry: req.body.fromCountry,
            fromState: req.body.fromState,
            currentCountry: req.body.currentCountry,
            currentState: req.body.currentState,
        },
        profession: req.body.profession,
        accent: req.body.accent,
        consulting_aggreement: req.body.consulting_aggreement,       
        ip: req.body.ip,
        browser: req.body.browser
    }
    if(req.body.imageProfileData === undefined) {
        teach.teacherProfilePic = undefined
    }
    if(req.body.languageSpeak != undefined) {
         teach.languageSpeak = JSON.parse(req.body.languageSpeak)
    }
    if(req.body.languageTeaches != undefined) {
        teach.languageTeaches = JSON.parse(req.body.languageTeaches)
    }
    return teach;
}
/**
 * 
 * @param {JSON String} resumes 
 * @param {Array} certificates 
 * @returns 
 */
exports.teacherExpirence = async (resumes, certificates) => {
    try {
    const teacherResumes = JSON.parse(resumes)
    const teacherCertificates = certificates

    for (let i = 0; i < teacherResumes.length; i++) {
        teacherCertificates[i]["id"] = teacherResumes[i].certificate_id
        teacherResumes[i]["certificate_data"] = teacherCertificates[i]
    }
    return teacherResumes;

} catch(err) {
    console.log(err)
}
}