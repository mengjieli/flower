#ifdef GL_ES
precision lowp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

uniform float width;
uniform float height;

uniform int scale9;
uniform float left;
uniform float top;
uniform float tleft;
uniform float ttop;
uniform float tright;
uniform float tbottom;
uniform float scaleGapX;
uniform float scaleGapY;
uniform float scaleX;
uniform float scaleY;
uniform int plist;
uniform float plistStartX;
uniform float plistEndX;
uniform float plistStartY;
uniform float plistEndY;

uniform int split;
uniform vec4 split1;
uniform vec4 splitSource1;
uniform vec4 splitOff1;
uniform vec4 split2;
uniform vec4 splitSource2;
uniform vec4 splitOff2;
uniform vec4 split3;
uniform vec4 splitSource3;
uniform vec4 splitOff3;
uniform vec4 split4;
uniform vec4 splitSource4;
uniform vec4 splitOff4;
uniform vec4 split5;
uniform vec4 splitSource5;
uniform vec4 splitOff5;
uniform vec4 split6;
uniform vec4 splitSource6;
uniform vec4 splitOff6;
uniform vec4 split7;
uniform vec4 splitSource7;
uniform vec4 splitOff7;
uniform vec4 split8;
uniform vec4 splitSource8;
uniform vec4 splitOff8;
uniform vec4 split9;
uniform vec4 splitSource9;
uniform vec4 splitOff9;
uniform vec4 split10;
uniform vec4 splitSource10;
uniform vec4 splitOff10;
uniform vec4 split11;
uniform vec4 splitSource11;
uniform vec4 splitOff11;
uniform vec4 split12;
uniform vec4 splitSource12;
uniform vec4 splitOff12;

uniform vec4 filters1;
uniform vec4 filters2;

uniform vec4 filtersParams0;
uniform vec4 filtersParams1;
uniform vec4 filtersParams2;
uniform vec4 filtersParams3;
uniform vec4 filtersParams4;
uniform vec4 filtersParams5;
uniform vec4 filtersParams6;
uniform vec4 filtersParams7;

uniform vec4 filters100;
uniform vec4 filtersParams100;
uniform vec4 filtersParams101;
uniform vec4 filtersParams102;
uniform vec4 filtersParams103;

vec4 getColorBeforeBlur(float posx,float posy);
vec4 getColor(float posx,float posy);
vec4 filter(vec4 color,float posx,float posy);
vec4 filter100(vec4 color,float posx,float posy);
vec4 dyeingFilter(vec4 color,float colorR,float colorG,float colorB);
vec4 colorFilter(vec4 color,float colorH,float colorS,float colorL);
vec4 strokeFilter(float strokeWidth,float r,float g,float b,float posx,float posy, vec4 color);
vec4 blurFilter(vec4 color,float posx,float posy,float blurX,float blurY);
vec2 changeToSplit(float posx,float posy);

void main()
{
    float posx = v_texCoord[0];
    float posy = v_texCoord[1];
    vec4 color = getColorBeforeBlur(posx,posy);
    //color = filter100(color,posx,posy);
    gl_FragColor = color;
}

vec4 getColorBeforeBlur(float posx,float posy) {
    vec4 color = getColor(posx,posy);
    color = filter(color,posx,posy);
    return color;
}

vec4 getColor(float posx,float posy) {
    if(scale9 > 0) {
        if(plist == 1) {
            posx = (posx - plistStartX) / (plistEndX - plistStartX);
            posy = (posy - plistStartY) / (plistEndY - plistStartY);
        }
        if(posx < tleft && posy < ttop) {
            posx = posx*scaleX;
            posy = posy*scaleY;
        } else if(posx < tright && posy < ttop) {
            posx = left + (posx - tleft)*scaleGapX;
            posy = posy*scaleY;
        } else if(posy < ttop) {
            posx = 1.0 - (1.0 - posx)*scaleX;
            posy = posy*scaleY;
        } else if(posx < tleft && posy < tbottom) {
            posx = posx*scaleX;
            posy = top + (posy - ttop)*scaleGapY;
        } else if(posx < tright && posy < tbottom){
            posx = left + (posx - tleft)*scaleGapX;
            posy = top + (posy - ttop)*scaleGapY;
        } else if(posy < tbottom) {
            posx = 1.0 - (1.0 - posx)*scaleX;
            posy = top + (posy - ttop)*scaleGapY;
        } else if(posx < tleft) {
            posx = posx*scaleX;
            posy = 1.0 - (1.0 - posy)*scaleY;
        } else if(posx < tright){
            posx = left + (posx - tleft)*scaleGapX;
            posy = 1.0 - (1.0 - posy)*scaleY;
        } else {
            posx = 1.0 - (1.0 - posx)*scaleX;
            posy = 1.0 - (1.0 - posy)*scaleY;
        }
        if(split) {
            vec2 point1 = changeToSplit(posx,posy);
            posx = point1[0];
            posy = point1[1];
        }
        if(plist == 1) {
            posx = posx * (plistEndX - plistStartX) + plistStartX;
            posy = posy * (plistEndY - plistStartY) + plistStartY;
        }
    } else {
        if(split) {
            vec2 point1 = changeToSplit(posx,posy);
            posx = point1[0];
            posy = point1[1];
        }
    }
    return v_fragmentColor * texture2D(CC_Texture0, vec2(posx,posy));
}

vec2 changeToSplit(float posx,float posy) {
    return vec2(posx,posy);
}

vec4 filter(vec4 color,float posx,float posy) {
    int pindex = 0;
    for(int f = 0; f < 8; f++) {
        float filterType;
        if(f < 4) {
            filterType = filters1[f];
        } else {
            filterType = filters2[f];
        }
        if(filterType == 0.0) {
            break;
        }
        vec4 params;
        if(pindex == 0) {
            params = filtersParams0;
        } else if(pindex == 1) {
            params = filtersParams1;
        } else if(pindex == 2) {
            params = filtersParams2;
        } else if(pindex == 3) {
            params = filtersParams3;
        } else if(pindex == 4) {
            params = filtersParams4;
        } else if(pindex == 5) {
            params = filtersParams5;
        } else if(pindex == 6) {
            params = filtersParams6;
        } else if(pindex == 7) {
            params = filtersParams7;
        }
        if(filterType == 1.0) {
            color = colorFilter(color,params[0],params[1],params[2]);
            pindex++;
        } else if(filterType == 2.0) {
            color = strokeFilter(params[0],params[1],params[2],params[3],posx,posy,color);
            pindex++;
        } else if(filterType == 3.0) {
            color = dyeingFilter(color,params[0],params[1],params[2]);
            pindex++;
        }
    }
    return color;
}

vec4 filter100(vec4 color,float posx,float posy) {
    int pindex = 0;
    for(int f = 0; f < 4; f++) {
        float filterType;
        filterType = filters100[f];
        vec4 params;
        if(pindex == 0) {
            params = filtersParams100;
        } else if(pindex == 1) {
            params = filtersParams101;
        } else if(pindex == 2) {
            params = filtersParams102;
        } else if(pindex == 3) {
            params = filtersParams103;
        }
        if(filterType == 100.0) {
            color = blurFilter(color,posx,posy,params[0],params[1]);
            pindex++;
        }
    }
    return color;
}

vec4 dyeingFilter(vec4 color,float colorR,float colorG,float colorB) {
    float sum = (color[0] + color[1] + color[2])/3.0;
    color[0] = sum==0.0?color[0]:colorR*sum;
    color[1] = sum==0.0?color[0]:colorG*sum;
    color[2] = sum==0.0?color[0]:colorB*sum;
    return color;
}

vec4 colorFilter(vec4 color,float colorH,float colorS,float colorL) {
    //rgb -> hsl
	float r = color[0];
	float g = color[1];
	float b = color[2];
	float min = r<g?(r<b?r:b):(g<b?g:b);
	float max = r>g?(r>b?r:b):(g>b?g:b);
	float h = 0.0;
	if(max == min) {
	    h = 0.0;
	} else if(max == r) {
	    if(g >= b) {
	        h = 60.0*(g-b)/(max-min) + 0.0;
	    } else {
	        h = 60.0*(g-b)/(max-min) + 360.0;
	    }
	} else if(max == g) {
	    h = 60.0*(b-r)/(max-min) + 120.0;
	} else {
	    h = 60.0*(r-g)/(max-min) + 240.0;
	}
	for(int n = 0; n < 10; n++) {
        if(h < 0.0) {
            h += 0.0;
        } else if(h > 360.0) {
            h -= 360.0;
        } else {
            break;
        }
	}
    float l = 0.5*(max+min);
    if(l > 1.0) {
        l = 1.0;
    } else if(l < 0.0) {
        l = 0.0;
    }
    float s = 0.0;
    if(l == 0.0 || max == min) {
        s = 0.0;
    } else if(l <= 0.5) {
        s = (max - min)*0.5/l;
    } else {
        s = (max - min)*0.5/(1.0-l);
    }
    if(s > 1.0) {
        s = 1.0;
    } else if(s < 0.0) {
        s = 0.0;
    }

    //control hsl
    h += colorH;
    if(colorS < 0.0) {
        s *= (colorS + 100.0)*0.01;
    } else {
        s *= 1.0 + colorS*0.002;
    }
    l += colorL/100.0;


    //hsl -> rgb
    if(s == 0.0) {
        color[0] = l;
        color[1] = l;
        color[2] = l;
    } else {
        float q = 0.0;
        if(l < 0.5) {
            q = l*(1.0 + s);
        } else {
            q = l + s - l*s;
        }
        float p = 2.0*l - q;
        float hk = h/360.0;
        float tr = hk + 1.0/3.0;
        float tg = hk;
        float tb = hk - 1.0/3.0;
        for(int n = 0; n < 10; n++) {
            if(tr < 0.0) {
                tr += 1.0;
            } else if(tr > 1.0) {
                tr -= 1.0;
            } else {
                break;
            }
        }
        for(int n = 0; n < 10; n++) {
            if(tg < 0.0) {
                tg += 1.0;
            } else if(tg > 1.0) {
                tg -= 1.0;
            } else {
                break;
            }
        }
        for(int n = 0; n < 10; n++) {
            if(tb < 0.0) {
                tb += 1.0;
            } else if(tb > 1.0) {
                tb -= 1.0;
            } else {
                break;
            }
        }
        if(tr < 1.0/6.0) {
            tr = p + ((q - p) * 6.0 * tr);
        } else if(tr < 0.5) {
            tr = q;
        } else if(tr < 2.0/3.0) {
            tr = p + ((q - p) * 6.0 * (2.0/3.0 - tr));
        } else {
            tr = p;
        }
        if(tg < 1.0/6.0) {
            tg = p + ((q - p) * 6.0 * tg);
        } else if(tg < 0.5) {
            tg = q;
        } else if(tg < 2.0/3.0) {
            tg = p + ((q - p) * 6.0 * (2.0/3.0 - tg));
        } else {
            tg = p;
        }
        if(tb < 1.0/6.0) {
            tb = p + ((q - p) * 6.0 * tb);
        } else if(tb < 0.5) {
            tb = q;
        } else if(tb < 2.0/3.0) {
            tb = p + ((q - p) * 6.0 * (2.0/3.0 - tb));
        } else {
            tb = p;
        }
        color[0] = tr;
        color[1] = tg;
        color[2] = tb;
    }
    return color;
}

vec4 strokeFilter(float strokeWidth, float r, float g, float b,float posx,float posy, vec4 color) {
    if(color[3] == 0.0) {
        const int max = 3;
        int size = int(strokeWidth);
        for(int x = -max; x < max; x++) {
            if(x < -size || x > size) continue;
            for(int y = -max; y < max; y++) {
                if(y < -size || y > size) continue;
                if(x == 0 && y == 0) continue;
                vec4 jcolor = getColor(posx + float(x)/width,posy + float(y)/height);
                if(jcolor[3] != 0.0) {
                    color[0] = r;
                    color[1] = g;
                    color[2] = b;
                    color[3] = 1.0;
                    return color;
                }
            }
        }
    }
    return color;
}

vec4 blurFilter(vec4 color,float posx,float posy,float blurX,float blurY) {
    const int max = 10;
    if(blurX == 0.0 && blurY == 0.0) {
        return color;
    }
    color[0] = 0.0;
    color[1] = 0.0;
    color[2] = 0.0;
    color[3] = 0.0;
    float count = 0.0;
    for(int x = -max; x < max; x++) {
        if(x < -int(blurX) || x > int(blurX)) continue;
        for(int y = -max; y < max; y++) {
        if(y < -int(blurY) || y > int(blurY)) continue;
            if(x == 0 && y == 0) continue;
            vec4 jcolor = getColorBeforeBlur(posx + float(x)/width,posy + float(y)/height);
            color[0] += jcolor[0];
            color[1] += jcolor[1];
            color[2] += jcolor[2];
            color[3] += jcolor[3];
            count++;
        }
    }
    color[0] /= count;
    color[1] /= count;
    color[2] /= count;
    color[3] /= count;
    return color;
}
