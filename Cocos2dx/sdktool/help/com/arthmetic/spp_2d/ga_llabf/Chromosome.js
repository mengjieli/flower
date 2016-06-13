var gallabf;
(function (gallabf) {
    var Chromosome = (function () {

        /**
         * 染色体
         *
         * 个体适应度 = 1/pacH
         *
         **/
        function Chromosome(fit,rk) {
            this.fitness = 0;	//适应度
            this.rank = null;	//方块的基因序列	[1,-2,5,4,-3] 标识排序为1,2,5,4,3 其中2,3为旋转
        }

        var d = __define, c = Chromosome;
        p = c.prototype;

        p.Chromosome = function(fit,rk)
        {
            this.fitness = fit;
            this.rank = rk;
        }

        p.clone()
        {
            var copy = [];
            for(var i = 0; i < this.rank.length; i++)
            {
                copy.push(this.rank[i]);
            }
            return new gallabf.Chromosome(this.fitness,copy);
        }

        return Chromosome;
    })();
    gallabf.Chromosome = Chromosome;
})(gallabf || (gallabf = {}));