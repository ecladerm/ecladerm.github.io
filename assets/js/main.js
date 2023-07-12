    $( document ).ready(function() {
        updateSizePanier();
    });

    jQuery($ => {
        $('form').on('submit', e => {
            $('#submit').prop('disabled', true);
            e.preventDefault();
            let dataPost = {
                nom: $("#nom").val(), 
                prenom: $("#prenom").val(), 
                adresse: $("#adresse").val(), 
                ville: $("#ville").val(), 
                email: $("#email").val(), 
                telephone: $("#telephone").val(), 
                commentaire: $("#commentaire").val(), 
                commande: $.cookie()
            };
            $.ajax({
                type: "POST",
                url: "./mail.html",
                data : JSON.stringify(dataPost),
                contentType : 'application/json',
                success: function(response) {
                    
                    deleteAllProduits();
                    $('#submit').prop('disabled', false);
                    
                    Swal.fire({
                        icon: 'success',
                        //html: 'Votre commande a bien été prise en compte. <br>Veuillez vérifier votre adresse mail pour le détail de la commande. <br>Pensez à regarder dans votre dossier Spam si vous ne la voyez pas arriver.',
                        html: 'Votre commande a bien été prise en compte.',
                        showConfirmButton: false,
                        iconColor: '#ff8674',
                        timer: 3000
                    }).then(function(data) {
                        window.location = "index.html";
                        //console.log(data);
                    });
                },
                error: function (request, status, error) {
                    Swal.fire({
                        icon: 'error',
                        html: 'Erreur lors de l\'enregistrement de la commande : (' + err  + ')',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    $('#submit').prop('disabled', false);
                }
            });
        });
    });

    function deleteAllProduits() {
        $.removeCookie("#SUNDERM");
        $.removeCookie("#ECLATWHITE");
        $.removeCookie("#HYDRADERM");
        $.removeCookie("#NETTODERM");
        updateSizePanier();
        updateTable();
        $("#nom").val(""); 
        $("#prenom").val(""); 
        $("#adresse").val("");
        $("#ville").val("");
        $("#email").val("");
        $("#telephone").val(""); 
        $("#commentaire").text(""); 
        $("#commentaire").val(""); 
    }

    function deleteProduit(id) {
        $.removeCookie(id);
        updateSizePanier();
        updateTable();
    }

    function updateProduitPanier(id, currentObj) {
        if (currentObj.value == "") {
            currentObj.value = 1;
        }

        $.cookie(id, JSON.stringify({size: currentObj.value, produit: JSON.parse($.cookie(id)).produit}));
        updateSizePanier();
        updateTable();
    }

    function updateTable() {
        var content = "";
        var size = 0;
        var total = 0;

                
        var elements =  ['#SUNDERM','#ECLATWHITE','#HYDRADERM','#NETTODERM',''];

        var hasElement = false;
        elements.forEach(function(item, index) {
            $.each($.cookie(), function(key, value) {
                //if (key.startsWith("#")) {
                if (key == item) {
                    hasElement = true;
                    const p = JSON.parse(value);
                    // parseInt(value)
                    //content += "<tr><td colspan='3'></td><td><h3>Total</h3></td><td>78 €</td></tr>";
                    content += "        <tr>";

                    


                    content += "                            <td>";
                    content += "                                    <img style='cursor: pointer' src='assets/imgs/trash.png' width='20' height='20' onclick='deleteProduit(\""+ p.produit.id +"\")'>";
                    content += "                           </td>";


                    content += "                            <td>";
                    content += "                                <a href='" + p.produit.href + "'>";
                    content += "                                    <img alt='item' src='" + p.produit.photo + "' width='50' height='70'>";
                    content += "                                </a>";
                    content += "                           </td>";
                    content += "                            <td>";
                    content += "                                <a href='" + p.produit.href + "'>";
                    content += "                                    " + p.produit.description;
                    content += "                                </a>";
                    content += "                            </td>";
                    content += "                            <td>";
                    content += "                                <span>" + p.produit.prixStr + "</span>";
                    content += "                            </td>";
                    content += "                            <td>";
                    content += "                                <div class='input-counter'>";
                    content += "                                    <input type='number' value='" + p.size +"' min='1' max='10' onchange='updateProduitPanier(\""+p.produit.id+"\", this)'>";
                    content += "                                </div>";
                    content += "                            </td>";
                    content += "                            <td>";
                    content += "                                <span>" + p.produit.prix * p.size + " DH</span>";
                    content += "                            </td>";
                    content += "                        </tr>";

                    size += p.size;
                    total += p.produit.prix * p.size;
                }
            });
        });

        if (size > 1) {
            content += "                        <tr><td></td><td colspan='4'><img src='assets/imgs/livraison.png' width='40' height='40'></td><td>0 DH</td></tr>";
        } else {
            total += 20;
            content += "                        <tr><td></td><td colspan='4'><img src='assets/imgs/livraison.png' width='40' height='40'></td><td>20 DH</td></tr>";
        }

        content += "                        <tr><td colspan='4'></td><td><h3>Total</h3></td><td><b>"+ total +" DH</b></td></tr>";

        $('#tab').html(content);

        // test hasElement;
        if (hasElement) {
            $("#divPanier").html("PANIER");
            $("#sectionPanier").show();
        } else {
            $("#divPanier").html("PANIER VIDE");
            $("#sectionPanier").hide();
        }

    }

    function updateSizePanier() {
        let size = 0;
        $.each($.cookie(), function(key, value) {
            if (key.startsWith("#")) {
                size += parseInt(JSON.parse($.cookie(key)).size);
            }
        });
        $("#panier").text(size);
    }

    function addProduit(id,href,photo,prix,prixStr,description) {
        let produit = {id: id,href: href,photo: photo,prix: prix,prixStr: prixStr,description: description};
        if ($.cookie(id) == undefined) {
            $.cookie(id, JSON.stringify({size: 0, produit: produit}));
        }
        

        $.cookie(id, JSON.stringify({size: parseInt(JSON.parse($.cookie(id)).size) + 1, produit: produit}) );
        updateSizePanier();

        const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            })

            Toast.fire({
                icon: 'success',
                iconColor: '#ff8674',
                title: 'Ajout bien effectué'
            })
    }

    function removeProduit(id,href,photo,prix,prixStr,description) {
        let produit = {id: id,href: href,photo: photo,prix: prix,prixStr: prixStr,description: description};
        if ($.cookie(id) != undefined) {
            $.cookie(id, JSON.stringify({size: parseInt(JSON.parse($.cookie(id)).size) - 1, produit: produit}) );
            updateSizePanier();

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            })

            Toast.fire({
                icon: 'success',
                iconColor: '#ff8674',
                title: 'Suppression bien effectuée'
            })
        }
    }
