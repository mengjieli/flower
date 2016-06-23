#ifdef GL_ES
precision lowp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

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

uniform int glowFilter;
uniform float width;
uniform float height;

uniform int colorFilter;
uniform float colorFilterH;
uniform float colorFilterS;
uniform float colorFilterL;

vec4 getColor(float posx,float posy);
vec4 filter(float posx,float posy, vec4 color);
vec4 getColorFilter(vec4 color,float colorH,float colorS,float colorL);

void main()
{
    float posx = v_texCoord[0];
    float posy = v_texCoord[1];
    vec4 color = getColor(posx,posy);
    if(colorFilter == 1) {
        color = getColorFilter(color,colorFilterH,colorFilterS,colorFilterL);
    }
    gl_FragColor = color;
}

vec4 filter(float posx,float posy, vec4 color) {
    if(color[3] == 0.0 && glowFilter == 1) {
        vec4 pointColor = getColor((posx*width-1.0/scaleX)/width,(posy*height)/height);
        if(pointColor[3] != 0.0) {
            color[3] = 1.0;
        } else {
            pointColor = getColor((posx*width+1.0/scaleX)/width,(posy*height)/height);
            if(pointColor[3] != 0.0) {
                color[3] = 1.0;
            }
            else {
                pointColor = getColor((posx*width)/width,(posy*height+1.0/scaleY)/height);
                if(pointColor[3] != 0.0) {
                   color[3] = 1.0;
                } else {
                    pointColor = getColor((posx*width)/width,(posy*height-1.0/scaleY)/height);
                    if(pointColor[3] != 0.0) {
                        color[3] = 1.0;
                    }
                }
            }
        }
    }
    return color;
}

vec4 getColor(float posx,float posy) {
    if(scale9 > 0) {
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
    }
    return v_fragmentColor * texture2D(CC_Texture0, vec2(posx,posy));
}

vec4 getColorFilter(vec4 color,float colorH,float colorS,float colorL) {
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