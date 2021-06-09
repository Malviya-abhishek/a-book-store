function status(x){
  if(x == 0)
    return "Order Placed";
  if(x == 1)
    return "Order Confirmed";
  if(x == 2)
    return "Out for delivery";
  if(x == 3)
    return "Order Completed";
  return "Order Canceled";
}

function statusToCode(s){
  if(s == "Order Placed") return 0;
  if(s == "Order Confirmed") return 1;
  if(s == "Out for delivery") return 2;
  if(s == "Order Completed") return 3;
  return -1;
}

exports.status = status;
exports.statusToCode = statusToCode;