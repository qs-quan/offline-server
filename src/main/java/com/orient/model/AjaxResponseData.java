package com.orient.model;

import java.io.Serializable;

/**
 * Created by enjoy on 2016/3/23 0023.
 * Ajax 请求泛型结果类
 */
public class AjaxResponseData<T> implements Serializable {

    /**
     * 泛型结果对象，回传信息需要用 CommonResponseData 的属性
     */
    private T results;

    public AjaxResponseData() {}

    public AjaxResponseData(T results) {
        this.results = results;
    }

    public T getResults() {
        return results;
    }

    public void setResults(T results) {
        this.results = results;
    }


}
