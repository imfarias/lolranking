const fetch = require('node-fetch');
const http = require('http');

http.createServer(onRequest).listen(process.env.PORT || 8080);

function onRequest(request, response) {

    const finalURL = "https://app.mobalytics.gg/api/lol/summoners/v1/BR/@SUBSTITUIR_USUARIO@/profile";

    const tierRanking = [
        'CHALLENGER',
        'GRANDMASTER',
        'MASTER',
        'DIAMOND',
        'PLATINUM',
        'GOLD',
        'SILVER',
        'BRONZE',
        'IRON',
    ];

    const userList = [
        'TABELINHA',
        'MDG Arcantola',
        'DIAFRAGMA',
        'ARES ALMEIDA',
        'LAQUEADURA',
        'CAMISINHA',
        'BARRIGA BG',
        'CONTRACEPTIVO',
        'DeydiCosta04',
        'DIUU',
        'PehdeCachorro',
        'VASECTOMIA',
        'ToddyBanda',
        'BloodMaryQueen'
    ];

    let ranking = [];

    userList.forEach(user => {

        (async () => {
            const responseData = await fetch(finalURL.replace('@SUBSTITUIR_USUARIO@', user));
            const data = await responseData.json();

            let gameType = data?.data?.gameTypes.filter(gameType => {
                return gameType.name === 'RANKED_SOLO_DUO';
            }).shift();

            if (gameType && gameType.rank) {
                ranking.push({
                    user: user,
                    icon: data.data.profile.summoner.icon,
                    tier: gameType?.rank.tier,
                    division: gameType?.rank.division,
                    lp: gameType.lp,
                    wins: gameType.wins,
                    losses: gameType.losses
                });

                ranking.sort(function (a, b) {
                    if (tierRanking.indexOf(a.tier) > tierRanking.indexOf(b.tier)) {
                        return 1;
                    } else if (tierRanking.indexOf(a.tier) < tierRanking.indexOf(b.tier)) {
                        return -1;
                    } else {
                        if (a.division > b.division) {
                            return 1;
                        } else if (a.division < b.division) {
                            return -1;
                        } else {
                            if (a.lp == b.lp) {
                                let aWins = a.wins / a.losses;
                                let bWins = b.wins / b.losses;

                                if (aWins > bWins) {
                                    return -1;
                                } else if (aWins < bWins) {
                                    return 1;
                                }

                                return 0;
                            }
                            return a.lp < b.lp ? 1 : -1;
                        }
                    }
                });

                if(ranking.length === userList.length) {

                    let html = `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr>
                                <td>#</td>
                                <td>Ícone</td>
                                <td>Nome</td>
                                <td>Elo</td>
                                <td>PDL</td>
                                <td>Vitórias</td>
                                <td>Derrotas</td>
                            </tr>
                        </thead>
                        <tbody>`;

                    ranking.forEach((user, index) => {
                        html += `<tr>
                            <td>${index + 1}</td>
                            <td><img src="https://cdn.mobalytics.gg/assets/lol/images/summoner-icon/${user.icon}.png" width="50px" heigth="50px" style="border-radius=50%"></td>
                            <td>${user.user}</td>
                            <td>${user.tier} ${user.division}</td>
                            <td>${user.lp}</td>
                            <td>${user.wins}</td>
                            <td>${user.losses}</td>
                        </tr>`;
                    });

                    console.log(ranking);

                    html += `</tbody>
                    </table>`;

                    response.writeHead(200, {
                        'Content-Type': 'text/html; charset=utf-8'
                    });
                    response.write(html);
                    response.end();
                }

            }

        })();

    });
}