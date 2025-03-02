export const formatPrice = (price) => {
    if (!price)
        return ''
    return price.toLocaleString('he-IL', { style: 'currency', currency: 'ILS'} )

    }
    //פונצקיה שמקבלת סכום ופשוט מוסיפה סימן של שקל