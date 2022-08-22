import React from 'react';
import { Grid } from "@material-ui/core";
import BalanceItem from 'js/containers/Balance/BalanceItem';
// import SwipeableViews from 'react-swipeable-views';
import OwlCarousel from "react-owl-carousel2";

export const BalanceGridInactive = coupons => {
    
    coupons = coupons.coupons;
    const perPage = 6;
    const pagesInt = parseInt(coupons.length / perPage, 10) < coupons.length / perPage ? parseInt(coupons.length / perPage, 10) + 1 : parseInt(coupons.length / perPage, 10);
    let pages = [];
        const settingsGeral = {
        items: 1,
        nav: true,
        loop: false,
        autoplay: false,
        dots: false,
        rewind: true,
        navText: ['<', '>']
    };

    for (let i = 1; i <= pagesInt; i++) {
        pages.push(i)
    };

    return (
        <div>
            <OwlCarousel options={settingsGeral} >
                {
                    pages.map((i,x) => {
                        return (
                            <Grid container spacing={3} style={{ width: '100%', margin: 0 }} key={'i' + x}>
                                {coupons.map((item, y) => {
                                    const showItem = (y+1) > perPage * (x+1) - perPage && (y+1) <= perPage * (x+1);
                                    
                                    if (showItem) {
                                        return <BalanceItem voucher={item} key={item.key}/>
                                    }
                                    else {
                                        return null;
                                    }
                                })
                                }
                            </Grid>
                        )
                    })
                }
            </OwlCarousel>
        </div>)
};
export default BalanceGridInactive;