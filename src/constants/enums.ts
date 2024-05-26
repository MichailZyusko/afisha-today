export enum Scenes {
  REGISTRATION_SCENE = 'REGISTRATION_SCENE',
  SUGGESTION_SCENE = 'SUGGESTION_SCENE',
  FEEDBACK_SCENE = 'FEEDBACK_SCENE',
}

export enum Age {
  CHILD = 'CHILD', // until 15
  TEENAGER = 'TEENAGER', // 16 - 18
  YOUNG_ADULT = 'YOUNG_ADULT', // 19 - 22
  ADULT = 'ADULT', // 23 - 28
  MIDDLE_ADULT = 'MIDDLE_AGED', // 29 - 35
  OLD_ADULT = 'OLD_ADULT', // 36 - 42
  SENIOR = 'SENIOR', // 43+
}

export enum Busyness {
  LOW = 'LOW', // less than 2 h
  MEDIUM = 'MEDIUM', // 2-4 h
  HIGH = 'HIGH', // more that 4 h
}

export enum Entertainment {
  ACTIVE = 'Активный отдых',
  CHILL_RELAX = 'Чилл и релакс',
  PARTY = 'Ночные вечеринки',
  BRAINSTORM = 'Интеллектуальные развлечения',
  FOOD = 'Посещение кафе, ресторанов, баров',
  ART = 'Творческий отдых',
}

export enum EventState {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',

  VIEWED = 'VIEWED',
  DECLINED = 'DECLINED',
}

export enum Agree {
  AGREE = 'AGREE',
  DISAGREE = 'DISAGREE',
}

export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum EventFeedback {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export enum EventFeedbackFinish {
  LEAVE_FEEDBACK = 'LEAVE_FEEDBACK',
  GET_NEW_EVENT = 'GET_NEW_EVENT',
}

export enum EventAgreement {
  APPROVE = 'APPROVE',
  BACK = 'BACK',
}

export enum EventFinish {
  DONE = 'DONE',
  REJECT = 'REJECT',
}
