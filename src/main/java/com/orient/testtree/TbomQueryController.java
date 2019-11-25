package com.orient.testtree;

import com.google.gson.Gson;
import com.orient.model.AjaxResponseData;
import com.orient.model.NodeResult;
import com.orient.util.HttpClientUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * ${DESCRIPTION}
 *
 * @author User
 * @create 2019-11-20 14:17
 */
@Controller
@RequestMapping("TbomQueryController")
public class TbomQueryController {


    @RequestMapping("/getSpecifiNode")
    @ResponseBody
    public AjaxResponseData getSpecifiNode(String nodeName, String isFilter) {
        Gson gson = new Gson();
        String url = "http://127.0.0.1:8010/OrientTDM/TbomQueryController/getSpecifiNode.rdm?" +
                "isFilter=" + isFilter;

        String result = HttpClientUtil.doGet(url);
        AjaxResponseData ret = new AjaxResponseData();
        List<NodeResult> treeNodeList = gson.fromJson(result, List.class);
        ret.setResults(treeNodeList);
        return ret;
    }

    @ResponseBody
    @RequestMapping("/getChildBom4LeftBomTree")
    public AjaxResponseData getChildBom4LeftBomTree(String cj, String nodeId) {
        Gson gson = new Gson();
        String url = "http://127.0.0.1:8010/OrientTDM/TbomQueryController/getChildBom4LeftBomTree.rdm?" +
                "cj=" + cj + "&nodeId=" + nodeId;
        String result = HttpClientUtil.doGet(url);
        AjaxResponseData ret = new AjaxResponseData();
        List<NodeResult> treeNodeList = gson.fromJson(result, List.class);
        ret.setResults(treeNodeList);
        return ret;
    }
}
