import { createAction } from 'typesafe-actions';

// export const setLanguage = createAction('translation/SET_LANGUAGE', resolve => {
//     return (language: any) => resolve(language);
// });

export const setLanguage = (language: any) => ({
    type: 'translation/SET_LANGUAGE',
    language,
});
