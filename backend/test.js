
const Razorpay = require ("razorpay");

const instance = new Razorpay({

    key_id: 'rzp_test_LDRMRR0ACNsfh7',
    key_secret: 'UJkdPv66gEyCt65hnHJVITZQ'
});


const main = async () => {

  try {
    
    const x = await instance.orders.create({
        "amount": 50000,
        "currency": "INR",
        "receipt": "receipt#1",
        "partial_payment": false,
        "notes": {
          "key1": "value3",
          "key2": "value2"
        }
    })

    console.log(x);
    
  } catch (error) {
    console.log(error);
    
  }
}

main()


