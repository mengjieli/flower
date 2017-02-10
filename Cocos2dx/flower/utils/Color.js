class Color {

    static RGB2HLS(r, g, b) {
        var h;
        var l;
        var s;
        var dr = r / 255;
        var dg = g / 255;
        var db = b / 255;
        var cmax = math.max(dr, math.max(dg, db));
        var cmin = math.min(dr, math.min(dg, db));
        var cdes = cmax - cmin;
        var hh, ll, ss;
        ll = (cmax + cmin) / 2;
        if (cdes) {
            if (ll <= 0.5)
                ss = (cmax - cmin) / (cmax + cmin);
            else
                ss = (cmax - cmin) / (2 - cmax - cmin);
            if (cmax == dr)
                hh = (0 + (dg - db) / cdes) * 60;
            else if (cmax == dg)
                hh = (2 + (db - dr) / cdes) * 60;
            else// if(cmax == b)
                hh = (4 + (dr - dg) / cdes) * 60;
            if (hh < 0)
                hh += 360;
        } else {
            hh = ss = 0;
        }
        h *= hh;
        l *= ll;
        s *= ss;
        return {
            h: h,
            l: l,
            s: s
        }
    }
}

exports.Color = Color;