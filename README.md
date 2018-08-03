# dragonvale-sandbox

this is the fundamental algorithm behind the dragonvale sandbox breeding calculator at https://dvbox.bin.sh/

## basic usage

    <script type="text/javascript" src="dragons.js"></script>
    <script type="text/javascript" src="calc.js"></script>
    <script type="text/javascript">
        list = breed_calc(d1,d2,beb);
    </script>

the function arguments d1 and d2 specify the parent dragons.  they are keys from the dragons.js file, such as "Panlong_Dragon".  beb is a boolean value which specifies whether or not bring-em-back is in effect.

## license

released to the public domain
http://creativecommons.org/publicdomain/zero/1.0/
