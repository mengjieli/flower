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

vec4 getColor(float posx,float posy);
vec4 filter(float posx,float posy, vec4 color);

void main()
{
    float posx = v_texCoord[0];
    float posy = v_texCoord[1];
    vec4 color = getColor(posx,posy);
    color = filter(posx,posy,color);
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