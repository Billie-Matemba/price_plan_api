export function totalPhoneBill(data, callPrice, smsPrice){
    const items = data.split(',');
    let callCount = 0;
    let smsCount = 0;
    for(let i=0; i<items.length; i++) {
      const item = items[i].trim();
      if (item.includes('call')) {
          callCount++;
      }
      if (item.includes('sms')) {
          smsCount++;
      }
    }
    const total = ((callCount*callPrice) +(smsCount*smsPrice));
    return 'R'+ total.toFixed(2);
  }
  