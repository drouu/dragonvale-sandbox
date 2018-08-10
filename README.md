# dragonvale-sandbox

`breed_calc()` is the core algorithm which runs the dragonvale sandbox breeding calculator at https://dvbox.bin.sh/

## basic usage

```html
<script type="text/javascript" src="dragons.js"></script>
<script type="text/javascript" src="calc.js"></script>
<script type="text/javascript">
    var list = breed_calc(d1,d2,beb);
</script>
```

the arguments `d1` and `d2` are keys from the `dragons.js` file, such as `Panlong_Dragon`, and specify the parent dragons.  `beb` is a boolean value which specifies whether or not bring-em-back is in effect.

for a working example, see https://drouu.github.io/dragonvale-sandbox/

## license

`calc.js` is free and released to the public domain.  http://unlicense.org/
