
var val=1500;
           
                var opts = {
                    lines: 12, // The number of lines to draw
                    angle: 0, // The length of each line
                    lineWidth: 0.4, // The line thickness
                    pointer: {
                        length: 0.75, // The radius of the inner circle
                        strokeWidth: 0.042, // The rotation offset
                        color: '#1D212A' // Fill color
                    },
                    limitMax: 'false', // If true, the pointer will not go past the end of the gauge
                    colorStart: '#1ABC9C', // Colors
                    colorStop: '#1ABC9C', // just experiment with them
                    strokeColor: '#F0F3F3', // to see which ones work best for you
                    generateGradient: true
                };
                // console.log("opts",opts)
                var target = document.getElementById('foo1'); // your canvas element
                var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
                gauge.maxValue = 6000; // set max gauge value
                gauge.animationSpeed = 32; // set animation speed (32 is default value)
                gauge.set(val); // set actual value

                var target = document.getElementById('foo2'); // your canvas element
                var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
                gauge.maxValue = 6000; // set max gauge value
                gauge.animationSpeed = 32; // set animation speed (32 is default value)
                gauge.set(val); // set actual value

                var target = document.getElementById('foo3'); // your canvas element
                var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
                gauge.maxValue = 6000; // set max gauge value
                gauge.animationSpeed = 32; // set animation speed (32 is default value)
                gauge.set(val); // set actual value

               



                
           
        
            
  


      

