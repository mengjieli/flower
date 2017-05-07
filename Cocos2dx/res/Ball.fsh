#ifdef GL_ES
precision lowp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
uniform float rotX;
uniform float rotY;

void main()
{
    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);

    //if(gl_FragColor[3] != 0.0) {

        float px = v_texCoord[0] - 0.5;
        float py = v_texCoord[1] - 0.5;

        if(px * px + py * py >= 0.25) {
            gl_FragColor[0] = 0.0;
            gl_FragColor[1] = 0.0;
            gl_FragColor[2] = 0.0;
            gl_FragColor[3] = 0.0;
        } else {
            float ry = acos(py/0.5);
            float rx = acos(px/(0.5*sin(ry)));

            rx += rotX * 3.1415926 / 180.0;
            ry += rotY * 3.1415926 / 180.0;

            py = cos(ry) * 0.5;
            px = sin(ry) * 0.5 * cos(rx);

            px += 0.5;
            py += 0.5;
            //px %= 25;
            //py %= 25;
            if(px < 0.0) {
                px = 1.0 + px;
            }
            if(py < 0.0) {
                py = 1.0 + py;
            }

            vec2 pos = vec2(px,py);
            gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, pos);
            //bmd.setPixel32(x,y,source.getPixel32(px,py));
        }
    //}


}