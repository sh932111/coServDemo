ctrl.startup = function()  {
    var  uriParts = '<%=ctx.pageURI %>'.split('/'),
         rsName = uriParts.length > 3  ?  uriParts[2] : '';

    switch (rsName)  {
        case 'booking':
            ctrl.sel('.bookMenu').addClass('active');
            break;
        case 'counter':
            ctrl.sel('.counterMenu').addClass('active');
            break;
        case 'package':
            ctrl.sel('.packageMenu').addClass('active');
            break;
        case 'porder':
            ctrl.sel('.porderMenu').addClass('active');
            break;
    }
};
