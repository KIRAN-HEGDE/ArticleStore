$(document).ready(() => {
    $('.delete-article').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/article/'+id,
            success: (res) => {
                alert('Deleting article');
                window.location.href='/';
            },
            error: (err) => {
                console.log(err);
            }
        })
    });
});