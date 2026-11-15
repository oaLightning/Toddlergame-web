# Character artwork catalog

The app loads `public/characters/manifest.json`. Each entry has a stable `id`, `name`, relative `src`, `sourceUrl`, `downloadUrl`, `group`, `attribution`, pixel dimensions, and `transparent` flag. All runtime images are local optimized WebP files; gameplay needs no remote image request.

## Sources and processing

Downloaded from official Bluey and Disney websites on 2026-11-15. Bluey assets are transparent character artwork; Disney assets are official square character portraits with backgrounds. Images are resized to a maximum 640 pixels, transparencies retained, negligible-alpha padding trimmed, and encoded as WebP. No generated or substitute character artwork is included.

Character artwork remains copyrighted by the credited owners. Source availability does not grant a redistribution license. This collection was assembled for the requested private family project; review permissions before public distribution.

The initial catalog includes 56 Bluey entries and all eight specifically requested Frozen/princess characters. The official Bluey directory lists 107 entries; additional minor characters can be added with the same schema. Its REST endpoint rejected direct access, so this batch uses the character artwork supplied in the official directory page.

## Catalog

| ID | Character | Group | Official source | Original image |
| --- | --- | --- | --- | --- |
| `bluey` | Bluey | bluey | [Page](https://www.bluey.tv/characters/bluey/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/07/Bluey-fixed-2.png) |
| `bingo` | Bingo | bluey | [Page](https://www.bluey.tv/characters/bingo/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/07/Bingo-fixed-1.png) |
| `bandit` | Bandit | bluey | [Page](https://www.bluey.tv/characters/bandit/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/b4.png) |
| `chilli` | Chilli | bluey | [Page](https://www.bluey.tv/characters/chilli/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Chilli-2.png) |
| `elsa` | Elsa | frozen | [Page](https://frozen.disney.com/) | [Image](https://lumiere-a.akamaihd.net/v1/images/ct_frozen_elsa_18466_22a50822_ad6090d1.jpeg?region=0%2C0%2C600%2C600) |
| `anna` | Anna | frozen | [Page](https://frozen.disney.com/) | [Image](https://lumiere-a.akamaihd.net/v1/images/ct_frozen_anna_18466_6775584b_520ae44b.jpeg?region=0%2C0%2C600%2C600) |
| `moana` | Moana | princess | [Page](https://princess.disney.com/) | [Image](https://lumiere-a.akamaihd.net/v1/images/ct_princess_moana_3497_0a28209c.jpeg?region=0,0,800,800) |
| `ariel` | Ariel | princess | [Page](https://princess.disney.com/) | [Image](https://lumiere-a.akamaihd.net/v1/images/ct_princess_ariel_3497_d17c9d8a.jpeg?region=0,0,800,800) |
| `rapunzel` | Rapunzel | princess | [Page](https://princess.disney.com/) | [Image](https://lumiere-a.akamaihd.net/v1/images/ct_princess_rapunzel_3497_5b2f90a4.jpeg?region=0,0,800,800) |
| `olaf` | Olaf | frozen | [Page](https://frozen.disney.com/) | [Image](https://lumiere-a.akamaihd.net/v1/images/ct_frozen_olaf_18466_eabe1344_2dd6212f.jpeg?region=0%2C0%2C600%2C600) |
| `kristoff` | Kristoff | frozen | [Page](https://frozen.disney.com/) | [Image](https://lumiere-a.akamaihd.net/v1/images/ct_frozen_kristoff_18466_dd7ff541_eda61723.jpeg?region=0%2C0%2C600%2C600) |
| `sven` | Sven | frozen | [Page](https://frozen.disney.com/) | [Image](https://lumiere-a.akamaihd.net/v1/images/ct_frozen_sven_18466_49fc954a_a5f98f25.jpeg?region=0%2C0%2C600%2C600) |
| `agatha` | Agatha | bluey | [Page](https://www.bluey.tv/characters/agatha/) | [Image](https://www.bluey.tv/wp-content/uploads/2025/07/Agatha-Scaled.png) |
| `alfie` | Alfie | bluey | [Page](https://www.bluey.tv/characters/alfie/) | [Image](https://www.bluey.tv/wp-content/uploads/2025/02/Aflie-Scaled.png) |
| `aunt-trixie` | Aunt Trixie | bluey | [Page](https://www.bluey.tv/characters/aunt-trixie/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Trixie-fixed.png) |
| `aunty-brandy` | Aunty Brandy | bluey | [Page](https://www.bluey.tv/characters/aunty-brandy/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Brandy.png) |
| `bartlebee` | Bartlebee | bluey | [Page](https://www.bluey.tv/characters/bartlebee/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/12/BBS.png) |
| `bentley` | Bentley | bluey | [Page](https://www.bluey.tv/characters/bentley/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/07/BENT-FIXDD.png) |
| `bob-bilby` | Bob Bilby | bluey | [Page](https://www.bluey.tv/characters/bob-bilby/) | [Image](https://www.bluey.tv/wp-content/uploads/2024/06/BB-FIXED-AGAIN.png) |
| `bobo` | Bobo | bluey | [Page](https://www.bluey.tv/characters/bobo/) | [Image](https://www.bluey.tv/wp-content/uploads/2024/06/BOBO.png) |
| `browny-bear` | Browny Bear | bluey | [Page](https://www.bluey.tv/characters/browny-bear/) | [Image](https://www.bluey.tv/wp-content/uploads/2024/10/BB-Scaled.png) |
| `bucky` | Bucky | bluey | [Page](https://www.bluey.tv/characters/bucky/) | [Image](https://www.bluey.tv/wp-content/uploads/2024/04/Bck-Scaled.png) |
| `calypso` | Calypso | bluey | [Page](https://www.bluey.tv/characters/calypso/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Calypso-fixed-1.png) |
| `chattermax` | Chattermax | bluey | [Page](https://www.bluey.tv/characters/chattermax/) | [Image](https://www.bluey.tv/wp-content/uploads/2024/10/Chat-scaled-1.png) |
| `chloe` | Chloe | bluey | [Page](https://www.bluey.tv/characters/chloe/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Chloe-fixed-1.png) |
| `chucky` | Chucky | bluey | [Page](https://www.bluey.tv/characters/chucky/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/chucky-fixed-2.png) |
| `coco` | Coco | bluey | [Page](https://www.bluey.tv/characters/coco/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Coco-fixed-1.png) |
| `floppy` | Floppy | bluey | [Page](https://www.bluey.tv/characters/floppy/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Floppy-shadow.png) |
| `frisky` | Frisky | bluey | [Page](https://www.bluey.tv/characters/frisky/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Frisky-shadow.png) |
| `gecky` | Gecky | bluey | [Page](https://www.bluey.tv/characters/gecky/) | [Image](https://www.bluey.tv/wp-content/uploads/2025/07/Gecky-scaled-1.png) |
| `gloria` | Gloria | bluey | [Page](https://www.bluey.tv/characters/gloria/) | [Image](https://www.bluey.tv/wp-content/uploads/2025/07/Gloria-scaled-1.png) |
| `grandad` | Grandad | bluey | [Page](https://www.bluey.tv/characters/grandad/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Mortf.png) |
| `grandpa-bob` | Grandpa Bob | bluey | [Page](https://www.bluey.tv/characters/grandpa-bob/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/07/Bob-1.png) |
| `honey` | Honey | bluey | [Page](https://www.bluey.tv/characters/honey/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Honey-fixed-1.png) |
| `indy` | Indy | bluey | [Page](https://www.bluey.tv/characters/indy/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/07/Indy-fixed.png) |
| `jack` | Jack | bluey | [Page](https://www.bluey.tv/characters/jack/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/07/Jack-fixed.png) |
| `janelle` | Janelle | bluey | [Page](https://www.bluey.tv/characters/janelle/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/07/Janelle-fixed.png) |
| `judo` | Judo | bluey | [Page](https://www.bluey.tv/characters/judo/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/07/Judo-fixed.png) |
| `kimjim` | Kimjim | bluey | [Page](https://www.bluey.tv/characters/kimjim/) | [Image](https://www.bluey.tv/wp-content/uploads/2024/01/KJ-scaled-1.png) |
| `lucky` | LUCKY | bluey | [Page](https://www.bluey.tv/characters/lucky/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Lucky-fixed-1.png) |
| `luckys-dad` | LUCKY’S DAD | bluey | [Page](https://www.bluey.tv/characters/luckys-dad/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Luckys-Dad-fixed-1.png) |
| `lila` | Lila | bluey | [Page](https://www.bluey.tv/characters/lila/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Lila-fixed.png) |
| `mackenzie` | Mackenzie | bluey | [Page](https://www.bluey.tv/characters/mackenzie/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Mackenzie-fixed-1.png) |
| `millicent` | Millicent | bluey | [Page](https://www.bluey.tv/characters/millicent/) | [Image](https://www.bluey.tv/wp-content/uploads/2025/07/Millicent-scaled-1.png) |
| `missy` | Missy | bluey | [Page](https://www.bluey.tv/characters/missy/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Missy-fixed-1.png) |
| `mr-cottonsocks` | Mr Cottonsocks | bluey | [Page](https://www.bluey.tv/characters/mr-cottonsocks/) | [Image](https://www.bluey.tv/wp-content/uploads/2025/07/Cottonsocks-scaled-2.png) |
| `mr-monkeyjocks` | Mr Monkeyjocks | bluey | [Page](https://www.bluey.tv/characters/mr-monkeyjocks/) | [Image](https://www.bluey.tv/wp-content/uploads/2025/07/Monkey-scaled-1.png) |
| `mrs-retriever` | Mrs Retriever | bluey | [Page](https://www.bluey.tv/characters/mrs-retriever/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Mrs-Rfixed.png) |
| `muffin` | Muffin | bluey | [Page](https://www.bluey.tv/characters/muffin/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/MUFFIN.png) |
| `nana` | Nana | bluey | [Page](https://www.bluey.tv/characters/nana/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/NANA-FIXED.png) |
| `polly-puppy` | Polly Puppy | bluey | [Page](https://www.bluey.tv/characters/polly-puppy/) | [Image](https://www.bluey.tv/wp-content/uploads/2025/07/Polly-scaled-1.png) |
| `pom-pom` | Pom Pom | bluey | [Page](https://www.bluey.tv/characters/pom-pom/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Pom-Pom-fixed-1.png) |
| `rusty` | Rusty | bluey | [Page](https://www.bluey.tv/characters/rusty/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Rusty-fixed-1.png) |
| `snickers` | Snickers | bluey | [Page](https://www.bluey.tv/characters/snickers/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/SNICK-2.png) |
| `socks` | Socks | bluey | [Page](https://www.bluey.tv/characters/socks/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/SOCKS.png) |
| `the-butlers` | The Butlers | bluey | [Page](https://www.bluey.tv/characters/the-butlers/) | [Image](https://www.bluey.tv/wp-content/uploads/2024/12/Butler-fix.png) |
| `the-gnomes` | The Gnomes | bluey | [Page](https://www.bluey.tv/characters/the-gnomes/) | [Image](https://www.bluey.tv/wp-content/uploads/2024/01/Gnomes-Scales.png) |
| `the-terriers` | The Terriers | bluey | [Page](https://www.bluey.tv/characters/the-terriers/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Terrier.png) |
| `the-tradies` | The Tradies | bluey | [Page](https://www.bluey.tv/characters/the-tradies/) | [Image](https://www.bluey.tv/wp-content/uploads/2024/02/Trad-fixed.png) |
| `uncle-rad` | Uncle Rad | bluey | [Page](https://www.bluey.tv/characters/uncle-rad/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Rad-Shadow.png) |
| `uncle-stripe` | Uncle Stripe | bluey | [Page](https://www.bluey.tv/characters/uncle-stripe/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Stripe-Shadow.png) |
| `unicorse` | Unicorse | bluey | [Page](https://www.bluey.tv/characters/unicorse/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/UNEw.png) |
| `wendy` | Wendy | bluey | [Page](https://www.bluey.tv/characters/wendy/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Wendy-fixed-1.png) |
| `winton` | Winton | bluey | [Page](https://www.bluey.tv/characters/winton/) | [Image](https://www.bluey.tv/wp-content/uploads/2023/09/Winton-Fixed-1.png) |
