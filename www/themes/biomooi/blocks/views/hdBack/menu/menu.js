ctrl.startup = function()  {
    var  pageURI = '<%=ctx.pageURI %>',
         modCode = pageURI.length > 2  ?  pageURI.substring(0, 3) : '';

    switch (modCode)  {
        case '/A/':
            ctrl.sel('.modA').addClass('active');
            break;
        case '/C/':
            ctrl.sel('.modC').addClass('active');
            break;
        case '/D/':
            ctrl.sel('.modD').addClass('active');
            break;
        case '/E/':
            ctrl.sel('.modE').addClass('active');
            break;
    }
};
