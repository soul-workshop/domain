import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';

type TelegramIdAlreadyExistsLocale = {
  text: 'На данный момент поддерживается только один аккаунт для, к сожалению сейчас это не поддерживается. Обратитесь в техподдержку, чтобы вам помогли решить эту проблему.',
  hint: { telegramId: number },
  name: 'TelegramIdAlreadyExistsError'
}

export type TelegramIdAlreadyExistsErrorError = ErrorDod<'TelegramIdAlreadyExistsError', TelegramIdAlreadyExistsLocale>
