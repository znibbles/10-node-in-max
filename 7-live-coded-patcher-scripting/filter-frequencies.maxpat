{"patcher":{"fileversion":1,"appversion":{"major":7,"minor":3,"revision":4,"architecture":"x86","modernui":1},"rect":[20.0,20.0,640.0,480.0],"bglocked":0,"openinpresentation":0,"default_fontsize":12.0,"default_fontface":0,"default_fontname":"Arial","gridonopen":1,"gridsize":[15.0,15.0],"gridsnaponopen":1,"objectsnaponopen":1,"statusbarvisible":2,"toolbarvisible":1,"lefttoolbarpinned":0,"toptoolbarpinned":0,"righttoolbarpinned":0,"bottomtoolbarpinned":0,"toolbars_unpinned_last_save":0,"tallnewobj":0,"boxanimatetime":200,"enablehscroll":1,"enablevscroll":1,"devicewidth":0.0,"description":"","digest":"","tags":"","style":"","subpatcher_template":"","boxes":[{"maxclass":"newobj","style":"","text":"mc.phasor~ 2","numinlets":2,"numoutlets":1,"id":"obj_1","patching_rect":[20,20,50,22]},{"maxclass":"newobj","style":"","text":"mc.*~ 2000","numinlets":2,"numoutlets":1,"id":"obj_2","patching_rect":[20,60,50,22]},{"maxclass":"newobj","style":"","text":"mc.+~ 200.","numinlets":2,"numoutlets":1,"id":"obj_3","patching_rect":[20,100,50,22]},{"maxclass":"newobj","style":"","text":"outlet ","numinlets":2,"numoutlets":0,"id":"obj_4","patching_rect":[20,140,50,22]}],"lines":[{"patchline":{"destination":["obj_4",0],"source":["obj_3",0]}},{"patchline":{"destination":["obj_3",0],"source":["obj_2",0]}},{"patchline":{"destination":["obj_2",0],"source":["obj_1",0]}}],"dependency_cache":[null],"autosave":0}}
