module.exports = {
    lidar: {
        minDistance: 10,       
        maxDistance: 4000,     
        averageDistance: 2000,
        signalStrength: 20,    
        temperature: 60  
    },

    camera: {
        focus: 30,          
        brightness: 30,       
        contrast: 20,
        noise: 50,       
        fps: 15           
    },

    pc: {
        cpu_usage: 90,        
        cpu_temp: 80,         
        gpu_usage: 95,
        gpu_temp: 85            
    },

    gps: {
        num_satellites: 4,      
        accuracy: 10      
    }
};