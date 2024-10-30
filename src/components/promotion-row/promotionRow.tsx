import React from 'react';
import {Promotion} from '../../shared/promotion.model';

interface PromotionRowProps {
    promotion: Promotion;
}

const PromotionRow: React.FC<PromotionRowProps> = ({promotion}) => {
    const {name, type, startDate, endDate, group} = promotion;

    return (
        <tr>
            <td>{name}</td>
            <td>{type}</td>
            <td>{startDate}</td>
            <td>{endDate}</td>
            <td>{group}</td>
        </tr>
    );
};

export default PromotionRow;
