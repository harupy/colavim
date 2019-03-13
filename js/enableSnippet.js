
const enableSnippet = (cell) => {
  const tabDefaultFunc = cell.CodeMirror.options.extraKeys['Tab'];
  const expandSnippetOrIndent = cm => {
    const cursor = cm.getCursor();
    const cursorLine= cm.getLine(cursor.line);
    const cursorLeft = cursorLine.slice(0, cursor.ch);
    const regex = /[^a-zA-Z0-9_]?([a-zA-Z0-9_]+)$/;
    const match = cursorLeft.match(regex)
    const prefix = match ? match[1] : '' ;
    const head = {line: cursor.line, ch: cursor.ch - prefix.length};
  
    const snippets = {
      'sl'     : 'select()',
      'al'     : 'alias()',
      'gb'     : 'groupBy()',
      'ob'     : 'orderBy()',
      'pb'     : 'partitionBy()',
      'fl'     : 'filter()',
      'srt'    : 'spark.read.table()',
      'srp'    : 'spark.read.parquet()',
      'fft'    : 'from pyspark.sql import functions as f, types as t',
      'cnt'    : 'count()',
      'rn'     : 'round()',
      'fna'    : 'fillna()',
      'cntd'   : 'countDistinct()',
      'btw'    : 'between()',
      'wc'     : 'withColumn()',
      'wcr'    : 'withColumnRenamed()',
      'dp'     : 'display()',
      'jn'     : 'join()',
      'ps'     : 'printSchema()',
      'sh'     : 'show()',
      'dt'     : 'distinct()',
      'tpd'    : 'toPandas()',
      'fc'     : 'f.col()',
      'scs'    : 'sqlContext.sql()',
      'agcnt'  : 'agg(f.count())',
      'agcntd' : 'agg(f.countDistinct())',
      'agsum'  : 'agg(f.sum())',
      'agmin'  : 'agg(f.min())',
      'agmax'  : 'agg(f.max())',
      'in'     : 'isNull()',
      'inn'    : 'isNotNull()',
      'ow'     : 'otherwise()',
    };
  
    if (prefix in snippets) {
      const body = snippets[prefix];
      cm.replaceRange(body, head, cursor);
      const match = body.match(/\)+$/);
      if (match) {
        cm.moveH(-match[0].length, 'char');
      }
    } else {
      tabDefaultFunc(cm);
    }
  }
  cell.CodeMirror.options.extraKeys['Tab'] = expandSnippetOrIndent;
}

export enableSnippet;