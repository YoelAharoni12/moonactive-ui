import {faker} from '@faker-js/faker'
import {Promotion, PromotionType} from './types'

const getRandomPromotionType = (): PromotionType => {
    const values = Object.values(PromotionType);
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
}

const createFakePromotion = (): Promotion => {
    const startDate = faker.date.anytime()

    return {
        promotionName: faker.word.noun(),
        type: getRandomPromotionType(),
        startDate,
        endDate: faker.date.future({refDate: startDate}),
        userGroupName: faker.word.noun()
    };
}

export default (count: number): Promotion[] =>
    faker.helpers.multiple(createFakePromotion, {
        count
    })