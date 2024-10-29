export enum PromotionType {
    Basic = 'basic',
    Common = 'common',
    Epic = 'epic'
}

export type Promotion = {
    promotionName: string,
    type: `${PromotionType}`,
    startDate: Date,
    endDate: Date,
    userGroupName: string
}