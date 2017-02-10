/**
 * 简单的多语言管理
 */
class Language {

    static __languages = {};

    static register(key, language, value) {
        if (!Language.__languages[language]) {
            Language.__languages[language] = {};
        }
        Language.__languages[language][key] = value;
    }

    static getLanguage(key, language) {
        return Language.__languages[language][key];
    }
}

exports.Language = Language;