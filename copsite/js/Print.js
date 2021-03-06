function Print() {
    var Print = document.getElementsByName("awindow")[0].src;
    var popupWin = window.open(Print, '_blank', 'width=900,height=900');
    popupWin.window.print();
    popupWin.document.close();
}


function Prints() {
    var divToPrint = document.getElementById('main');
    var popupWin = window.open('', '_blank', 'width=900,height=600');
    popupWin.document.open();
    popupWin.document.write("<html><head><script type='text/javascript'>function rem() { var remove = document.getElementById('breadandprint'); ");
    popupWin.document.write("remove.parentNode.removeChild(remove);}");
    popupWin.document.write("<\/sc" + "ript>");
    popupWin.document.write("<style> a { font-size:14px !important;} </style></head>");
    popupWin.document.write("<link rel='stylesheet' type='text/css'  class='notranslate' href='../../../style.css'>");
    popupWin.document.write('<body onload="rem(); window.print();" style="font-size:14px;">' + divToPrint.innerHTML + '</html>');
    popupWin.document.close();
}

function PrintLarge() {
    var divToPrint = document.getElementById('main');
    var popupWin = window.open('', '_blank', 'width=900,height=600');
    popupWin.document.open();
    popupWin.document.write("<html><head><script type='text/javascript'>function rem() { var remove = document.getElementById('breadandprint'); ");
    popupWin.document.write("remove.parentNode.removeChild(remove);}");
    popupWin.document.write("<\/sc" + "ript>");
    popupWin.document.write("<style> a { font-size:20px !important;} td { font-size:20px !important;} </style></head>");
    popupWin.document.write("<link rel='stylesheet' type='text/css'  class='notranslate' href='../../../style.css'>");
    popupWin.document.write('<body onload="rem(); window.print();" style="font-size:24px !important; background:#F1F1E5;">' + divToPrint.innerHTML + '</html>');
    popupWin.document.close();
    
}